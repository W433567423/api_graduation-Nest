import { Body, Controller, Post, Res, Session } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegistryUserDto } from '@/modules/users/dto/create-user.dto';
import { CreateAppDto } from '@/modules/app/dto/create-app.dto';

@ApiTags('用户管理')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '注册用户' })
  @ApiResponse({
    status: '2XX',
    type: CreateAppDto,
  })
  @Post('registry')
  async registry(
    @Body() signupData: RegistryUserDto,
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    const { username, password, valida } = signupData;
    const { captcha: validaServer } = session;

    await this.usersService.registry(
      username,
      password,
      valida,
      validaServer || '',
    );
    return res.send({ code: 201, message: '注册成功' });
  }

  @ApiOperation({ summary: '用户登录' })
  @Post('login')
  login() {
    // console.log(loginData);
    return '用户登录';
  }
}
