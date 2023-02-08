import { Test, TestingModule } from '@nestjs/testing';
import { demoUser } from '../../../../test/user/user.mock';
import { InternalCacheModule } from '../../../internal-cache/internal-cache.module';
import { PostService } from '../post.service';
import { demoPost, PostRepositoryMock } from '../../../../test/post/post.mock';
import { CategoryRepositoryMock } from '../../../../test/category/category.mock';

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
describe('PostService', () => {
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [InternalCacheModule],
      providers: [
        PostService,
        {
          provide: 'PostRepository',
          useClass: PostRepositoryMock,
        },
        {
          provide: 'CategoryRepository',
          useClass: CategoryRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get user posts', async () => {
    const response = await service.findAll({ page: 1, per_page: 50 }, demoUser);
    expect(response.data).toBeDefined();
    expect(response.meta).toBeDefined();
  });

  it('should get single post', async () => {
    const response = await service.findOne(demoPost.id, demoUser);
    expect(response.data['name']).toBe(demoPost.name);
    expect(response.data['text']).toBe(demoPost.text);
  });

  it('should update user profile', async () => {
    const response = await service.update(
      demoPost.id,
      {
        name: demoPost.name,
        text: demoPost.text,
      },
      demoUser,
    );
    expect(response).toBeUndefined();
  });

  it('should delete a category', async () => {
    const response = await service.remove(demoPost.id, demoUser);
    expect(response).toBeUndefined();
  });
});
