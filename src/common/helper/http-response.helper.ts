import { HttpException, HttpStatus } from '@nestjs/common';
import { IPaginationMeta } from 'nestjs-typeorm-paginate/dist/interfaces';

export class HttpResponseHelper {
  static send(
    message: string,
    data?: { data?: Record<string, any>; meta?: IPaginationMeta },
  ) {
    return {
      status: true,
      message,
      ...(data?.data && { data: data.data }),
      ...(data?.meta && { meta: data.meta }),
    };
  }

  static error(
    code: string,
    message: string,
    content: Record<string, unknown>,
  ) {
    const data = {
      status: false,
      message,
      data: content,
    };

    throw new HttpException(data, HttpStatus[code]);
  }
}
