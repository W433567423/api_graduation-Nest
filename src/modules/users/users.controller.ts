import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { statusFive, statusFour } from '@/config';
import { RegistryUserDto } from '@/modules/users/dto/create-user.dto';

@ApiTags('用户管理')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '注册用户' })
  @ApiResponse({
    status: '2XX',
    description: '系统成功响应',
  })
  @ApiResponse(statusFour)
  @ApiResponse(statusFive)
  @Post('registry')
  registry(@Body() signupData: RegistryUserDto) {
    console.log(signupData);
    return '注册用户';
  }

  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({
    status: '2XX',
    description: '系统成功响应',
  })
  @ApiResponse(statusFour)
  @ApiResponse(statusFive)
  @Post('login')
  login() {
    // console.log(loginData);
    return '用户登录';
  }
}
