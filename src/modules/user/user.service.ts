import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ILogin, IRegister, IService, IUser } from '../../common/interfaces';
import * as bcrypt from 'bcryptjs';
import { JwtHelper } from '../../common/helper/jwt.helper';
import { InternalCacheService } from '../../internal-cache/internal-cache.service';
import { JWT_SECRET_EXPIRES } from '../../config/env.config';

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

  async changePassword(
    payload: { old_password: any; password: any },
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
}
