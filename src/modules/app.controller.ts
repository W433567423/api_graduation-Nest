import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SERVER_PORT, statusFive, statusFour, swaggerPrefix } from '@/config';
import { defaultAppResDto } from '@/modules/app-dto/app.res.dto';
import { NoAuth } from '@/global/decorator';

@ApiTags('入口')
@Controller()
export class AppController {
  constructor() {}
  @Get()
  @ApiOperation({ summary: '后台系统入口' })
  @ApiResponse({
    status: '2XX',
    description: '系统成功响应',
    type: defaultAppResDto,
  })
  @ApiResponse(statusFour)
  @ApiResponse(statusFive)
  @NoAuth()
  hallo() {
    return `<h1>hallo, this is tutu の graduation</h1><hr/><li>the swagger address is <a href="http://localhost:${SERVER_PORT}/${swaggerPrefix}">localhost:${SERVER_PORT}/${swaggerPrefix}</a>;</li>`;
  }
}
