import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { demoUser, UserRepositoryMock } from '../../../../test/user/user.mock';
import { InternalCacheModule } from '../../../internal-cache/internal-cache.module';

describe('UserService', () => {
  let service: UserService;
  let token: string;

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
    token = response.data['token'];
    expect(response.data['first_name']).toBe(demoUser.first_name);
    expect(response.data['email']).toBe(demoUser.email);
  });

  it('should get active user', async () => {
    const response = await service.getProfile(demoUser);
    expect(response.data['first_name']).toBe(demoUser.first_name);
    expect(response.data['email']).toBe(demoUser.email);
  });

  it('should request forgot password', async () => {
    const response = await service.forgotPassword({
      email: demoUser.email,
    });
    expect(response).toBeUndefined();
  });

  it('should reset password with OTP', async () => {
    const response = await service.resetPassword({
      code: '123456',
      password: 'password',
    });
    expect(response).toBeUndefined();
  });

  it('should change password', async () => {
    const response = await service.changePassword(
      { old_password: 'password', password: 'password' },
      demoUser,
    );
    expect(response).toBeUndefined();
  });

  it('should update user profile', async () => {
    const response = await service.updateProfile(
      {
        first_name: demoUser.first_name,
        last_name: demoUser.last_name,
        phone_number: demoUser.phone_number,
      },
      demoUser,
    );
    expect(response).toBeUndefined();
  });

  it('should logout user', async () => {
    const response = await service.logoutUser(token);
    expect(response).toBeUndefined();
  });
});
