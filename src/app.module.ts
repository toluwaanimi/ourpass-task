import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './modules/api.module';
import { join } from 'path';
import { POSTGRES_DB_URL } from './config/env.config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ApiModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: POSTGRES_DB_URL,
      logging: false,
      namingStrategy: new SnakeNamingStrategy(),
      synchronize: true,
      migrationsRun: true,
      entities: [join(__dirname, '../dist/**/**/**.js')],
      migrations: [join(__dirname, '../dist/migrations/**.js')],
      subscribers: [join(__dirname, '../dist/subscribers/**.js')],
      extra: {
        ssl:
          process.env.NODE_ENV === 'production' ||
          process.env.NODE_ENV === 'staging' ||
          process.env.NODE_ENV === 'development',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
