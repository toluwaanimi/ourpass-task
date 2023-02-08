import { IPaginationMeta } from 'nestjs-typeorm-paginate/dist/interfaces';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export interface IUser {
  id: string;

  first_name: string;

  last_name: string;

  email: string;

  password: string;

  phone_number: string;
}

export interface ILogin {
  email: string;

  password: string;
}

export interface IRegister {
  email: string;

  first_name: string;

  last_name: string;

  password: string;

  phone_number: string;
}
export interface IService {
  data?: Record<string, any> | Record<string, any>[];
  meta?: IPaginationMeta;
}

export interface IPaginate {
  page: number;

  per_page: number;
}
