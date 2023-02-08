import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ILogin, IRegister, IService, IUser } from '../../common/interfaces';
import * as bcrypt from 'bcryptjs';
import { JwtHelper } from '../../common/helper/jwt.helper';
import { InternalCacheService } from '../../internal-cache/internal-cache.service';
import { JWT_SECRET_EXPIRES } from '../../config/env.config';
import { Helpers } from '../../common/helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly internalCacheService: InternalCacheService,
  ) {}

  async login(input: ILogin): Promise<IService> {
    const user = await this.userRepository.findOne({
      where: {
        email: input.email,
      },
    });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    if (!bcrypt.compareSync(input.password, user.password)) {
      throw new BadRequestException('Invalid credentials');
    }

    const jwt = await JwtHelper.signToken(user);
    await this.internalCacheService.set(jwt, user.id, {
      ttl: JWT_SECRET_EXPIRES,
    });
    return {
      data: {
        ...user.toJSON(),
        token: jwt,
      },
    };
  }

  async register(payload: IRegister): Promise<IService> {
    payload.email = payload.email.toLowerCase();
    payload.phone_number = payload.phone_number.replace('+', '');

    const foundUser = await this.userRepository.findOne({
      where: [{ email: payload.email }, { phone_number: payload.phone_number }],
    });
    if (foundUser) {
      if (foundUser.phone_number === payload.phone_number) {
        throw new BadRequestException('Phone number already exist');
      }

      if (foundUser.email === payload.email) {
        throw new BadRequestException('Email already exist');
      }
    }

    try {
      const user = await this.userRepository.save({
        first_name: payload.first_name,
        last_name: payload.last_name,
        email: payload.email,
        password: bcrypt.hashSync(payload.password, 8),
        phone_number: payload.phone_number,
      });

      delete user.password;

      const jwt = await JwtHelper.signToken(user);
      await this.internalCacheService.set(jwt, user.id, {
        ttl: JWT_SECRET_EXPIRES,
      });
      return {
        data: {
          ...user,
          token: jwt,
        },
      };
    } catch (e) {
      console.log(e);
      throw new BadRequestException(
        'Something went wrong, kindly contact support',
      );
    }
  }

  async getProfile(user: IUser): Promise<IService> {
    const account = await this.userRepository.findOne({
      where: {
        id: user.id,
      },
    });
    if (!account) {
      throw new BadRequestException('Invalid account');
    }
    return {
      data: account.toJSON(),
    };
  }

  async forgotPassword(payload: { email: string }): Promise<IService> {
    const user = await this.userRepository.findOne({
      where: {
        email: payload.email,
      },
    });
    if (!user) {
      throw new BadRequestException('Invalid account with this email');
    }

    const code = Helpers.generateOTP(6);
    await this.internalCacheService.set(code, user.id, { ttl: 3600 });
    // Implement event to push to a queue for notification
    return;
  }

  async resetPassword(payload: {
    password: string;
    code: string;
  }): Promise<IService> {
    const userId = await this.internalCacheService.get(payload.code);
    if (!userId) {
      throw new BadRequestException('OTP expired');
    }

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new BadRequestException('OTP expired');
    }
    await this.userRepository.update(
      {
        id: user.id,
      },
      {
        password: bcrypt.hashSync(payload.password, 8),
      },
    );
    await this.internalCacheService.delete(payload.code);
    return;
  }

  async changePassword(
    payload: { old_password: string; password: string },
    user: IUser,
  ): Promise<IService> {
    if (!bcrypt.compareSync(payload.old_password, user.password)) {
      throw new BadRequestException('Invalid old password');
    }
    await this.userRepository.update(
      {
        id: user.id,
      },
      {
        password: bcrypt.hashSync(payload.password, 8),
      },
    );
    return;
  }

  async updateProfile(
    payload: { first_name?: string; last_name?: string; phone_number?: string },
    user: IUser,
  ): Promise<IService> {
    await this.userRepository.update(
      {
        id: user.id,
      },
      {
        first_name: payload.first_name || user.first_name,
        last_name: payload.last_name || user.last_name,
        phone_number: payload.phone_number || user.phone_number,
      },
    );
    return;
  }

  async logoutUser(userToken): Promise<IService> {
    const token = await this.internalCacheService.get(userToken);
    if (!token) {
      throw new BadRequestException('Something went wrong');
    }

    await this.internalCacheService.delete(userToken);
    return;
  }
}
