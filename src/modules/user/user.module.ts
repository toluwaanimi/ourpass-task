import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { InternalCacheModule } from '../../internal-cache/internal-cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), InternalCacheModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
