import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from '../interfaces';

export const GetCurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
