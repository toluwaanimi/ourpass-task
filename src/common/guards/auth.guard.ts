import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { JWT_SECRET } from '../../config/env.config';
import { User } from '../../modules/user/entities/user.entity';
import { InternalCacheService } from '../../internal-cache/internal-cache.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly internalCacheService: InternalCacheService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const Authorization = request.get('Authorization');
      if (!Authorization) {
        throw new UnauthorizedException('Unauthorized request');
      }
      const token = Authorization.split(' ');
      if (!((token[1] && token[0] === 'Bearer') || token[0] === 'bearer')) {
        throw new UnauthorizedException('Unauthorized request');
      }

      const cachedToken = await this.internalCacheService.get(token[1]);
      if (!cachedToken) {
        throw new UnauthorizedException('Unauthorized request');
      }
      let decrypt;
      try {
        decrypt = await verify(token[1], JWT_SECRET);
      } catch (e) {
        throw new UnauthorizedException('Unauthorized request');
      }

      if (!decrypt) {
        throw new UnauthorizedException('Unauthorized request');
      }

      const user = await getRepository(User).findOne({
        where: { id: decrypt.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Unauthorized request');
      }

      request.user = user;
      request.token = token[1];
      return true;
    } catch (e) {
      throw new UnauthorizedException('Unauthorized request');
    }
  }
}
