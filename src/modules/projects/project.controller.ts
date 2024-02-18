import {
  Controller,
  Patch,
  Post,
  Body,
  Get,
  Query,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { ProjectsService } from './project.service';
import {
  createProjectReqDto,
  reNameProjectReqDto,
  getListReqDto,
  deleteProjectReqDto,
  disableProjectReqDto,
} from './dtos/project.req.dto';
import { getListResDto } from './dtos/project.res.dto';
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
  @ApiResponse({
    status: '2XX',
    description: '系统成功响应',
    type: getListResDto,
  })
  async getList(
    @Query() _query: getListReqDto,
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
  ): Promise<IResData<IGetListRes>> {
    const dbRes = await this.projectsService.getList(page, size);
    const projectTotal = await this.projectsService.getProjectTotal();

    return { data: { list: dbRes, total: projectTotal } };
  }

  @ApiOperation({ summary: '重命名项目' })
  @Patch('rename')
  async auth(@Body() data: reNameProjectReqDto): Promise<IResData<null>> {
    await this.projectsService.reName(data.projectId, data.newName);

    return { msg: '项目重命名成功' };
  }

  @ApiOperation({ summary: '禁用项目' })
  @Patch('disable')
  async disable(@Body() data: disableProjectReqDto): Promise<IResData<null>> {
    await this.projectsService.setProjectDisable(data.projectIds, data.disable);

    return { msg: '项目改变禁用状态成功' };
  }

  @ApiOperation({ summary: '删除项目' })
  @Delete('delete')
  async delet(@Body() data: deleteProjectReqDto): Promise<IResData<null>> {
    await this.projectsService.deleteByIds(data.projectIds);

    return { msg: '项目删除成功' };
  }
}
