import { Test, TestingModule } from '@nestjs/testing';
import { demoUser, UserRepositoryMock } from '../../../../test/user/user.mock';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { InternalCacheModule } from '../../../internal-cache/internal-cache.module';

describe('UserController', () => {
  let controller: UserController;
  let token: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [InternalCacheModule],
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: 'UserRepository',
          useClass: UserRepositoryMock,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be log user in with email and password', async () => {
    const response = await controller.loginUser({
      email: demoUser.email,
      password: 'password',
    });
    token = response.data['token'];
    expect(response.data['first_name']).toBe(demoUser.first_name);
    expect(response.data['email']).toBe(demoUser.email);
  });

  it('should get active account by authorization', async () => {
    const response = await controller.getProfile(demoUser);
    expect(response.data['first_name']).toBe(demoUser.first_name);
    expect(response.data['email']).toBe(demoUser.email);
  });

  it('should change password', async () => {
    const response = await controller.changePassword(
      { old_password: 'password', password: 'password' },
      demoUser,
    );
    expect(response).toBeDefined();
  });

  it('should request forgot password', async () => {
    const response = await controller.forgotPassword({
      email: demoUser.email,
    });
    expect(response).toBeDefined();
  });

  it('should reset password with OTP', async () => {
    const response = await controller.resetPassword({
      code: '123456',
      password: 'password',
    });
    expect(response).toBeDefined();
  });

  it('should change password', async () => {
    const response = await controller.changePassword(
      { old_password: 'password', password: 'password' },
      demoUser,
    );
    expect(response).toBeDefined();
  });

  it('should update user profile', async () => {
    const response = await controller.updateProfile(
      {
        first_name: demoUser.first_name,
        last_name: demoUser.last_name,
        phone_number: demoUser.phone_number,
      },
      demoUser,
    );
    expect(response).toBeDefined();
  });

  it('should logout user', async () => {
    const response = await controller.logoutUser(token);
    expect(response).toBeDefined();
  });
});
