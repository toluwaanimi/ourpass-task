import { Test, TestingModule } from '@nestjs/testing';
import { demoUser } from '../../../../test/user/user.mock';
import { InternalCacheModule } from '../../../internal-cache/internal-cache.module';
import { CategoryService } from '../category.service';
import {
  CategoryRepositoryMock,
  demoCategory,
} from '../../../../test/category/category.mock';
import { faker } from '@faker-js/faker';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn().mockResolvedValue({
    items: [].slice(0, 2),
    meta: {
      itemCount: 2,
      totalItems: 2,
      totalPages: 1,
      currentPage: 1,
    },
  }),
}));
describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [InternalCacheModule],
      providers: [
        CategoryService,
        {
          provide: 'CategoryRepository',
          useClass: CategoryRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get user categories', async () => {
    const response = await service.findAll({ page: 1, per_page: 50 }, demoUser);
    expect(response.data).toBeDefined();
    expect(response.meta).toBeDefined();
  });

  it('should get single category', async () => {
    const response = await service.findOne(demoCategory.id, demoUser);
    expect(response.data['name']).toBe(demoCategory.name);
    expect(response.data['slug']).toBe(demoCategory.slug);
  });

  it('should update user profile', async () => {
    const response = await service.update(
      demoCategory.id,
      {
        name: demoCategory.name,
        slug: demoCategory.slug,
      },
      demoUser,
    );
    expect(response).toBeUndefined();
  });

  it('should delete a category', async () => {
    const response = await service.remove(demoCategory.id, demoUser);
    expect(response).toBeUndefined();
  });
});
