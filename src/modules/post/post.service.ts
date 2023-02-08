import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { Category } from '../category/entities/category.entity';
import { CreatePostDTO, UpdatePostDTO } from './dto/post.dto';
import { IPaginate, IService, IUser } from '../../common/interfaces';
import { paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createPostDto: CreatePostDTO, user: IUser): Promise<IService> {
    const category = await this.categoryRepository.findOne({
      where: {
        id: createPostDto.categoryId,
      },
    });
    if (!category) {
      throw new NotFoundException('Invalid category ID');
    }
    const post = await this.postRepository.save({
      name: createPostDto.name,
      text: createPostDto.text,
      categoryId: category.id,
      userId: user.id,
    });
    return {
      data: post,
    };
  }

  async findAll(query: IPaginate, user: IUser): Promise<IService> {
    const posts = await paginate(
      this.postRepository,
      {
        page: query.page ? query.page : 1,
        limit: query.per_page ? query.per_page : 50,
      },
      {
        where: {
          userId: user.id,
        },
      },
    );
    return {
      data: posts.items,
      meta: posts.meta,
    };
  }

  async findOne(id: string, user: IUser): Promise<IService> {
    const post = await this.postRepository.findOne({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!post) {
      throw new NotFoundException('Invalid post');
    }
    return {
      data: post,
    };
  }

  async update(
    id: string,
    updateCategoryDto: UpdatePostDTO,
    user: IUser,
  ): Promise<IService> {
    const category = await this.categoryRepository.findOne({
      where: {
        id: updateCategoryDto.categoryId,
        userId: user.id,
      },
    });
    if (!category) {
      throw new NotFoundException('Invalid category');
    }

    const post = await this.postRepository.findOne({
      where: {
        categoryId: category.id,
        id,
        userId: user.id,
      },
    });

    if (!post) {
      throw new NotFoundException('Invalid post');
    }

    await this.postRepository.update(
      {
        id,
        userId: user.id,
      },
      {
        name: updateCategoryDto.name || post.name,
        text: updateCategoryDto.text || post.text,
        categoryId: updateCategoryDto.categoryId || post.categoryId,
      },
    );
    return;
  }

  async remove(id: string, user: IUser): Promise<IService> {
    const category = await this.postRepository.findOne({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!category) {
      throw new NotFoundException('Invalid post');
    }
    await this.postRepository.softDelete({ id, userId: user.id });
    return;
  }
}
