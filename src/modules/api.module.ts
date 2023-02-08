import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [UserModule, PostModule, CategoryModule],
  controllers: [],
  providers: [],
})
export class ApiModule {}
