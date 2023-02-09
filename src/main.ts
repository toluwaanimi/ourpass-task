import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { GlobalExceptionsFilter } from './common/exceptions';
import { ValidationPipe } from '@nestjs/common';
import { NODE_ENV, PORT } from './config/env.config';
import { CustomLogger } from './common/logger/logger';
import * as compression from 'compression';
import { setupSwagger } from './config/swagger';
import { seedRecord } from './common/database/seeder/seeder';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new GlobalExceptionsFilter());
  app.setGlobalPrefix('/api/v1/');
  setupSwagger(app);
  app.use(compression());
  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();
  await app.listen(PORT);
  CustomLogger.verbose(
    `OurPass started on ${NODE_ENV} environment with port ${PORT}`,
  );

  seedRecord().then();
}
bootstrap().then();
