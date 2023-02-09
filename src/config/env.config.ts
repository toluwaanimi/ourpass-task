import * as env from 'env-var';
import { config } from 'dotenv';

config();

export const NODE_ENV = env.get('NODE_ENV').asString();
export const PORT = env.get('PORT').required().asInt();
export const JWT_SECRET = env.get('JWT_SECRET').required().asString();

export const JWT_SECRET_EXPIRES = env
  .get('JWT_SECRET_EXPIRES')
  .required()
  .asInt();

export const JWT_REFRESH_SECRET = env
  .get('JWT_REFRESH_SECRET')
  .required()
  .asString();

export const TEST_POSTGRES_DB_URL = env.get('TEST_POSTGRES_DB_URL').asString();
export const POSTGRES_DB_URL = env.get('POSTGRES_DB_URL').required().asString();

export const REDIS_HOST = env.get('REDIS_HOST').asString();
export const REDIS_PORT = env.get('REDIS_PORT').asInt();
export const REDIS_PASSWORD = env.get('REDIS_PASSWORD').asString();
