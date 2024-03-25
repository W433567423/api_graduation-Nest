import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { peaceLoginReqDto, peacePostReqDto } from './dtos/peace.req.dot';
import { PeaceService } from './peace.service';

@ApiTags('平安平台')
@Controller('peace')
export class PeaceController {
  constructor(private readonly peaceService: PeaceService) {}

  @ApiOperation({ summary: '发送Get请求' })
  @Post('get')
  @ApiQuery({ name: 'url', description: '链接', required: true })
  async get(@Query('url') url: string) {
    const res = await this.peaceService.GET(url);

    return res;
  }
  @ApiOperation({ summary: '发送Post请求' })
  @Post('post')
  @ApiQuery({ name: 'url', description: '链接', required: true })
  async post(@Body() data: peacePostReqDto) {
    const res = await this.peaceService.POST(data.url, data.data);

    return res;
  }

  @ApiOperation({ summary: '登录' })
  @Post('login')
  async login(@Body() data: peaceLoginReqDto) {
    const res = await this.peaceService.login(data);

    return { data: { peaceCookie: res.cookie, peaceUser: res.data } };
  }

  @ApiOperation({ summary: '获取菜单列表' })
  @Post('getMenu')
  async getMenu() {
    const res = await this.peaceService.getMenu();

    return res;
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

  @ApiOperation({ summary: '获取充值信息' })
  @Get('payMessage')
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
  payMessage(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    const res = this.peaceService.getPayMessage(page, limit);
    return res;
  }

  @ApiOperation({ summary: '获取通道列表' })
  @Get('channelList')
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
  channelList(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    const res = this.peaceService.getChannelList(page, limit);
    return res;
  }
}
