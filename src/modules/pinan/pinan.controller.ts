import { NoAuth } from '@/global/decorator';
import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Session,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { pinanLoginReqDto } from './dtos/pinan.req.dot';
import { PinanService } from './pinan.service';

@NoAuth()
@ApiTags('平安平台')
@Controller('pinan')
export class PinanController {
  constructor(private readonly pinanService: PinanService) {}

  @ApiOperation({ summary: '登录' })
  @Post('login')
  async login(
    @Body() data: pinanLoginReqDto,
    @Session() session: { pinanCookie: string | undefined },
  ) {
    const res = await this.pinanService.login(data);

    session.pinanCookie = res.cookie;
    return res.data;
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
    @Session() session: { pinanCookie: string | undefined },
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    const res = this.pinanService.getProductMessage(
      session.pinanCookie || '',
      page,
      limit,
    );
    return res;
  }
}
