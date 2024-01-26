import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SERVER_PORT, statusFive, statusFour, swaggerPrefix } from '@/config';
import { CreateAppDto } from '@/modules/app/dto/create-app.dto';

@ApiTags('入口')
@Controller()
export class AppController {
  constructor() {}
  @Get()
  @ApiOperation({ summary: '后台系统入口' })
  @ApiResponse({
    status: '2XX',
    description: '系统成功响应',
    type: CreateAppDto,
  })
  @ApiResponse(statusFour)
  @ApiResponse(statusFive)
  hallo() {
    return {
      code: 200,
      message: `<h1>hallo, this is tutu の graduation</h1><hr/><li>the swagger address is <a href="http://localhost:${SERVER_PORT}/${swaggerPrefix}">localhost:${SERVER_PORT}/${swaggerPrefix}</a>;</li>`,
    };
  }
}
