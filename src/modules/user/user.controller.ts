import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ForgotPasswordDTO,
  LoginDTO,
  RegisterDTO,
  ResetPasswordDTO,
  UpdateAccountDTO,
} from './dto/user.dto';
import { HttpResponseHelper } from '../../common/helper/http-response.helper';
import {
  GetCurrentToken,
  GetCurrentUser,
} from '../../common/decorators/get-user.decorator';
import { AuthGuard } from '../../common/guards/auth.guard';
import { IUser } from '../../common/interfaces';

@Controller('user')
@ApiTags('user')
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

  @Post('auth/forgot-password')
  @ApiOperation({ summary: 'Request forgot password token' })
  @HttpCode(200)
  async forgotPassword(@Body() body: ForgotPasswordDTO) {
    await this.userService.forgotPassword(body);
    return HttpResponseHelper.send('request successful');
  }

  @Post('auth/forgot-password')
  @ApiOperation({ summary: 'Reset password with token ' })
  @HttpCode(200)
  async resetPassword(@Body() body: ResetPasswordDTO) {
    await this.userService.resetPassword(body);
    return HttpResponseHelper.send('request successful');
  }

  @Get('account')
  @ApiOperation({ summary: 'Get user profile' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  async getProfile(@GetCurrentUser() user: IUser) {
    const response = await this.userService.getProfile(user);
    return HttpResponseHelper.send('profile retrieved', response);
  }

  @Put('account')
  @ApiOperation({ summary: 'update user account' })
  @HttpCode(200)
  async updateProfile(
    @Body() body: UpdateAccountDTO,
    @GetCurrentUser() user: IUser,
  ) {
    await this.userService.updateProfile(body, user);
    return HttpResponseHelper.send('update  successful');
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user session' })
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  async logoutUser(@GetCurrentToken() token: string) {
    await this.userService.logoutUser(token);
    return HttpResponseHelper.send('logout successful');
  }
}
