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

export interface IService {
  data?: Record<string, any> | Record<string, any>[];
  meta?: Record<string, unknown>;
}
