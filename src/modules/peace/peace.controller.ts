import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { peaceLoginReqDto } from './dtos/peace.req.dot';
import { PeaceService } from './peace.service';

@ApiTags('平安平台')
@Controller('peace')
export class PeaceController {
  constructor(private readonly peaceService: PeaceService) {}

  @ApiOperation({ summary: '登录' })
  @Post('login')
  async login(@Body() data: peaceLoginReqDto) {
    const res = await this.peaceService.login(data);

    return { data: { peaceCookie: res.cookie, peaceUser: res.data } };
  }

  @ApiOperation({ summary: '获取产码信息' })
  @Get('producedYard')
  @ApiQuery({
    name: 'page',
    example: 1,
    required: true,
    type: Number,
    description: '页码',
  })
  @ApiQuery({
    name: 'limit',
    example: 20,
    required: true,
    type: Number,
    description: '每页数量',
  })
  getProductMessage(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    const res = this.peaceService.getProductMessage(page, limit);
    return res;
  }
}
