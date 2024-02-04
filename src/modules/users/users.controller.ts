import { Body, Controller, Get, Post, Req, Session } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  userLoginReqDto,
  userRegistryReqDto,
  userforgetPasswordReqDto,
} from '@/modules/users/dto/user.req.dto';
import { NoAuth } from '@/global/decorator';
import { userRegistryAndLoginResDto } from '@/modules/users/dto/user.res.dto';
import type { IReqUser, IResData, IUser } from '../index';

@ApiTags('用户管理')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '注册用户' })
  @ApiResponse({
    status: '2XX',
    type: userRegistryAndLoginResDto,
  })
  @NoAuth()
  @Post('registry')
  async registry(
    @Body() signupData: userRegistryReqDto,
    @Session() session: { emailCaptchaServer: number | undefined },
  ): Promise<IResData<string>> {
    const { username, password, emailValida, emailNum } = signupData;
    const { emailCaptchaServer } = session;

    const token = await this.usersService.registry(
      username,
      password,
      emailValida,
      emailCaptchaServer || 0,
      emailNum,
    );
    return { code: 201, msg: '注册成功', data: token };
  }

  @ApiOperation({ summary: '用户登录' })
  @NoAuth()
  @ApiResponse({
    status: '2XX',
    type: userRegistryAndLoginResDto,
  })
  @Post('login')
  async login(
    @Body() signupData: userLoginReqDto,
    @Session() session: { captchaServer: string | undefined },
  ): Promise<IResData<string>> {
    const { username, password, valida } = signupData;

    const { captchaServer } = session;

    return {
      data: await this.usersService.login(
        username,
        password,
        valida,
        captchaServer || '',
      ),
    };
  }

  @ApiOperation({ summary: '用户忘记密码' })
  @NoAuth()
  @Post('forgetPassword')
  async forgetPassword(
    @Body() signupData: userforgetPasswordReqDto,
    @Session() session: { emailCaptchaServer: number | undefined },
  ): Promise<IResData<null>> {
    const { emailValida, emailNum, newPassword } = signupData;
    const { emailCaptchaServer } = session;

    await this.usersService.forget(
      emailNum,
      newPassword,
      emailValida,
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
