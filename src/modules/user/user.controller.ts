import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation } from '@nestjs/swagger';
import { LoginDTO, RegisterDTO } from './dto/user.dto';
import { HttpResponseHelper } from '../../common/helper/http-response.helper';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('auth/login')
  @ApiOperation({ summary: 'Login with email and password' })
  @HttpCode(200)
  async loginUser(@Body() body: LoginDTO) {
    const response = await this.userService.login(body);
    return HttpResponseHelper.send('login successful', response);
  }

  @Post('auth/register')
  @ApiOperation({ summary: 'Register user account' })
  @HttpCode(200)
  async registerUser(@Body() body: RegisterDTO) {
    await this.userService.register(body);
    return HttpResponseHelper.send('registration successful');
  }
}
