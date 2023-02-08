import {
  JWT_REFRESH_SECRET,
  JWT_SECRET,
  JWT_SECRET_EXPIRES,
} from '../../config/env.config';
import { sign } from 'jsonwebtoken';
import { JwtPayload } from '../interfaces';
import { User } from '../../modules/user/entities/user.entity';

export class JwtHelper {
  static async signToken(user: User) {
    const payload: JwtPayload = {
      id: user.id,
    };
    return sign(payload, JWT_SECRET, { expiresIn: JWT_SECRET_EXPIRES });
  }

  static async refreshJWT(user: User) {
    const payload: JwtPayload = {
      id: user.id,
    };
    return sign(payload, JWT_REFRESH_SECRET, { expiresIn: 172800000 });
  }
}
