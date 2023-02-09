import {
  JWT_REFRESH_SECRET,
  JWT_SECRET,
  JWT_SECRET_EXPIRES,
  PORT,
} from '../../config/env.config';
import { sign } from 'jsonwebtoken';
import { JwtPayload } from '../interfaces';
import { User } from '../../modules/user/entities/user.entity';

export class JwtHelper {
  static async signToken(user: User) {
    const payload = {
      iss: 'http://localhost:' + PORT,
      sub: user.id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + JWT_SECRET_EXPIRES,
    };

    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };

    return sign(payload, JWT_SECRET, { header });
  }

  static async refreshJWT(user: User) {
    const payload: JwtPayload = {
      id: user.id,
    };
    return sign(payload, JWT_REFRESH_SECRET, { expiresIn: 172800000 });
  }
}
