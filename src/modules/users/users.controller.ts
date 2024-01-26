import { Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateAppDto } from '@/modules/app/dto/create-app.dto';
import { statusFive, statusFour } from '@/config';

@ApiTags('用户管理')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '注册用户' })
  @ApiResponse({
    status: '2XX',
    description: '系统成功响应',
    type: CreateAppDto,
  })
  @ApiResponse(statusFour)
  @ApiResponse(statusFive)
  @Post('registry')
  registry() {}
}
