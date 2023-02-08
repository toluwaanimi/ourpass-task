import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { demoUser, UserRepositoryMock } from '../../../../test/user/user.mock';
import { InternalCacheModule } from '../../../internal-cache/internal-cache.module';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [InternalCacheModule],
      providers: [
        UserService,
        {
          provide: 'UserRepository',
          useClass: UserRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should login a user', async () => {
    const response = await service.login({
      email: demoUser.email,
      password: 'password',
    });
    expect(response.data['first_name']).toBe(demoUser.first_name);
    expect(response.data['email']).toBe(demoUser.email);
  });

  it('should get active user', async () => {
    const response = await service.getProfile(demoUser);
    expect(response.data['first_name']).toBe(demoUser.first_name);
    expect(response.data['email']).toBe(demoUser.email);
  });

  it('should change password', async () => {
    const response = await service.changePassword(
      { old_password: 'password', password: 'password' },
      demoUser,
    );
    expect(response).toBeUndefined();
  });
});
