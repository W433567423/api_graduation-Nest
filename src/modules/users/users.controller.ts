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
    @Session() session: Record<string, any>,
  ) {
    const { username, password, emailValida, emailNum } = signupData;
    const { emailCaptcha: emailCaptcha } = session;

    const token = await this.usersService.registry(
      username,
      password,
      emailValida,
      emailCaptcha || '',
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
    @Session() session: Record<string, any>,
  ) {
    const { username, password, valida } = signupData;
    const { captcha: validaServer } = session;

    return await this.usersService.login(
      username,
      password,
      valida,
      validaServer || '',
    );
  }

  @ApiOperation({ summary: '用户忘记密码' })
  @NoAuth()
  @ApiResponse({
    status: '2XX',
  })
  @Post('forgetPassword')
  async forgetPassword(
    @Body() signupData: userforgetPasswordReqDto,
    @Session() session: Record<string, any>,
  ) {
    const { emailValida, emailNum, newPassword } = signupData;
    const { emailCaptcha: validaServer } = session;
    console.log(emailNum, emailValida, validaServer);
    this.usersService.forget(emailNum, newPassword, emailValida, validaServer);
    // return await this.usersService.login(
    //   username,
    //   password,
    //   valida,
    //   validaServer || '',
    // );
  }

  @ApiOperation({ summary: '鉴权' })
  @Get('auth')
  auth(@Req() req: Request) {
    return (req as any).user;
  }
}
