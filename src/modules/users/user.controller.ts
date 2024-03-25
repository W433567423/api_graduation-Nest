import { NoAuth } from '@/global/decorator';
import {
  userForgetPasswordReqDto,
  userLoginReqDto,
  userRegistryReqDto,
} from '@/modules/users/dtos/user.req.dto';
import { userLoginResDto } from '@/modules/users/dtos/user.res.dto';
import { Body, Controller, Get, Post, Req, Session } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { IReqUser, IResData, IUser } from '../index';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('用户管理')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '注册用户' })
  @ApiResponse({
    status: '2XX',
    type: userLoginResDto,
  })
  @NoAuth()
  @Post('registry')
  async registry(
    @Body() signupData: userRegistryReqDto,
    @Session() session: { emailCaptchaServer: number | undefined },
  ): Promise<IResData<{ token: string; user: UserEntity }>> {
    const { username, password, emailValid, emailNum } = signupData;
    const { emailCaptchaServer } = session;

    const res = await this.userService.registry(
      username,
      password,
      emailValid,
      emailCaptchaServer || 0,
      emailNum,
    );
    return {
      code: 201,
      msg: '注册成功',
      data: { token: res.token, user: res.user },
    };
  }

  @ApiOperation({ summary: '用户登录' })
  @NoAuth()
  @ApiResponse({
    status: '2XX',
    type: userLoginResDto,
  })
  @Post('login')
  async login(
    @Body() signupData: userLoginReqDto,
    @Session() session: { captcha: string | undefined },
  ): Promise<IResData<{ token: string; user: UserEntity }>> {
    const { username, password, valid } = signupData;

    const { captcha } = session;
    console.log('🚀 ~ UserController ~ captcha:', captcha);

    return {
      data: await this.userService.login(
        username,
        password,
        valid,
        captcha || '',
      ),
    };
  }

  @ApiOperation({ summary: '用户忘记密码' })
  @NoAuth()
  @Post('forgetPassword')
  async forgetPassword(
    @Body() signupData: userForgetPasswordReqDto,
    @Session() session: { emailCaptchaServer: number | undefined },
  ): Promise<IResData<null>> {
    const { emailValid, emailNum, newPassword } = signupData;
    const { emailCaptchaServer } = session;

    await this.userService.forget(
      emailNum,
      newPassword,
      emailValid,
      emailCaptchaServer || 0,
    );
    return { msg: '密码重置成功' };
  }

  @ApiOperation({ summary: '鉴权' })
  @ApiBearerAuth('JWT-auth')
  @Get('auth')
  auth(@Req() req: IReqUser): IResData<IUser | undefined> {
    return { data: req.user };
  }
}
