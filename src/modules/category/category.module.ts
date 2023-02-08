import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { InternalCacheModule } from '../../internal-cache/internal-cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), InternalCacheModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
