import axios, { AxiosRequestConfig } from 'axios';
import { BadRequestException } from '@nestjs/common';
import * as OTP from 'n-digit-token';
import * as referenceGenerator from 'random-string-generator';
import * as crypto from 'crypto';

export class Helpers {
  static async sendRequest(requestConfig: AxiosRequestConfig): Promise<any> {
    try {
      const response = await axios(requestConfig);
      return response.data;
    } catch (err) {
      throw new BadRequestException(
        err.response.data.message || err.response.data.error,
      );
    }
  }

  static generateHash(payload: any, secret: string) {
    return crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(payload))
      .digest('hex');
  }

  static generateOTP(length: number): string {
    const token = OTP.gen(length).toString();
    return '123456';
  }

  static generateIdReference(
    type: 'numeric' | 'string' = 'numeric',
    prefix = '',
    length = 40,
  ): string {
    const numeric =
      Date.now().toString() +
      Math.floor(Math.random() * 1000000500000000000 + 1).toString();
    return type === 'numeric'
      ? numeric
      : prefix + referenceGenerator(length, 'lowernumeric');
  }

  static generateReference(
    type: 'numeric' | 'string' = 'numeric',
    prefix = '',
    length = 40,
  ): string {
    const numeric =
      Date.now().toString() +
      Math.floor(Math.random() * 1000000500000000000 + 1).toString();
    return type === 'numeric'
      ? numeric
      : prefix + referenceGenerator(length, 'uppernumeric');
  }

  static capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
