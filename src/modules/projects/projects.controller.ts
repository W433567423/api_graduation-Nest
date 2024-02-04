import {
  Controller,
  Patch,
  Post,
  Body,
  Get,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import {
  createProjectReqDto,
  reNameProjectReqDto,
  getListReqDto,
} from './dto/project.req.dto';
import type { IResData } from '../index';
import type { IGetListRes } from './index';

@ApiTags('项目管理')
@ApiBearerAuth('JWT-auth')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({ summary: '创建项目' })
  @Post('create')
  async create(@Body() data: createProjectReqDto): Promise<IResData<string>> {
    await this.projectsService.create(data.projectName);

    return { code: 201, msg: '项目创建成功' };
  }

  @ApiOperation({ summary: '获取项目列表' })
  @Get('list')
  async getList(
    @Query() _query: getListReqDto,
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
  ): Promise<IResData<IGetListRes>> {
    const dbRes = await this.projectsService.getList(page, size);

    return { data: { list: dbRes[0], total: dbRes[1] } };
  }

  @ApiOperation({ summary: '重命名项目' })
  @Patch('rename')
  async auth(@Body() data: reNameProjectReqDto): Promise<IResData<null>> {
    await this.projectsService.reName(data.projectName, data.newName);

    return { msg: '项目重命名成功' };
  }
}
