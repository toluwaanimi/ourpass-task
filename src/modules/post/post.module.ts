import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Category } from '../category/entities/category.entity';
import { InternalCacheModule } from '../../internal-cache/internal-cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Category]), InternalCacheModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
