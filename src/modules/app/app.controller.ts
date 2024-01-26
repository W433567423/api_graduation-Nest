import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SERVER_PORT, swaggerPrefix } from '@/config';
import { CreateAppDto } from '@/modules/app/dto/create-app.dto';

@ApiTags('入口')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  @ApiOperation({ summary: '后台系统入口' })
  @ApiResponse({
    status: 200,
    description: '系统成功响应',
    type: CreateAppDto,
  })
  @ApiResponse({
    status: 400,
    description: '系统内部错误',
  })
  hallo() {
    return {
      code: 200,
      message: `<h1>hallo, this is tutu の graduation</h1><hr/><li>the swagger address is <a href="http://localhost:${SERVER_PORT}/${swaggerPrefix}">localhost:${SERVER_PORT}/${swaggerPrefix}</a>;</li>`,
    };
  }
}
