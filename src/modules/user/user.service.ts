import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ILogin, IService } from '../../common/interfaces';
import * as bcrypt from 'bcryptjs';
import { JwtHelper } from '../../common/helper/jwt.helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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
    return {
      data: {
        ...user.toJSON(),
        token: jwt,
      },
    };
  }

  async register(payload): Promise<IService> {
    payload.email = payload.email.toLowerCase();
    payload.username = payload.username.toLowerCase();
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
      return {
        data: {
          ...user,
          token: jwt,
        },
      };
    } catch (e) {
      throw new BadRequestException(
        'Something went wrong, kindly contact support',
      );
    }
  }
}
