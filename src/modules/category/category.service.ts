import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDTO, UpdateCategoryDTO } from './dto/category.dto';
import { IPaginate, IService, IUser } from '../../common/interfaces';
import { paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(
    createCategoryDto: CreateCategoryDTO,
    user: IUser,
  ): Promise<IService> {
    const existingCategory = await this.categoryRepository.findOne({
      where: [
        {
          name: createCategoryDto.name,
          userId: user.id,
        },
        {
          slug: createCategoryDto.slug.toLowerCase(),
          userId: user.id,
        },
      ],
    });
    console.log(existingCategory);
    if (existingCategory) {
      throw new BadRequestException('Category exist already');
    }
    const category = await this.categoryRepository.save({
      name: createCategoryDto.name,
      slug: createCategoryDto.slug,
      userId: user.id,
    });
    return {
      data: category,
    };
  }

  async findAll(query: IPaginate, user: IUser): Promise<IService> {
    const categories = await paginate(
      this.categoryRepository,
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
      data: categories.items,
      meta: categories.meta,
    };
  }

  async findOne(id: string, user: IUser): Promise<IService> {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!category) {
      throw new NotFoundException('Invalid category');
    }
    return {
      data: category,
    };
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDTO,
    user: IUser,
  ): Promise<IService> {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!category) {
      throw new NotFoundException('Invalid category');
    }

    await this.categoryRepository.update(
      {
        id,
        userId: user.id,
      },
      {
        name: updateCategoryDto.name || category.name,
        slug: updateCategoryDto.slug.toLowerCase() || category.slug,
      },
    );
    return;
  }

  async remove(id: string, user: IUser): Promise<IService> {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!category) {
      throw new NotFoundException('Invalid category');
    }
    await this.categoryRepository.softDelete({ id, userId: user.id });
    return;
  }
}
