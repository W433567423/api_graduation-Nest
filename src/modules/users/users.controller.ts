import { Body, Controller, Get, Post, Req, Res, Session } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  userLoginReqDto,
  userRegistryReqDto,
  userforgetPasswordReqDto,
} from '@/modules/users/dto/user.req.dto';
import { NoAuth } from '@/global/decorator';
import { userRegistryAndLoginResDto } from '@/modules/users/dto/user.res.dto';

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
    @Res() res: Response,
    @Session() session: { captchaServer: string | undefined },
  ) {
    const { username, password, emailValida, emailNum } = signupData;
    const { captchaServer } = session;

    const token = await this.usersService.registry(
      username,
      password,
      emailValida,
      captchaServer || '',
      emailNum,
    );
    return res.send({ code: 201, message: '注册成功', data: token });
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
  ) {
    const { username, password, valida } = signupData;

    const { captchaServer } = session;

    return await this.usersService.login(
      username,
      password,
      valida,
      captchaServer || '',
    );
  }

  @ApiOperation({ summary: '用户忘记密码' })
  @NoAuth()
  @Post('forgetPassword')
  async forgetPassword(
    @Body() signupData: userforgetPasswordReqDto,
    @Session() session: { emailCaptchaServer: number | undefined },
  ) {
    const { emailValida, emailNum, newPassword } = signupData;
    const { emailCaptchaServer } = session;

    await this.usersService.forget(
      emailNum,
      newPassword,
      emailValida,
      emailCaptchaServer || 0,
    );
    return 'ok';
  }

  @ApiOperation({ summary: '鉴权' })
  @Get('auth')
  auth(@Req() req: Request) {
    return (req as any).user;
  }
}
