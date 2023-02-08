import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from '../interfaces';

export const GetCurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

export const GetCurrentToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.token;
  },
);
