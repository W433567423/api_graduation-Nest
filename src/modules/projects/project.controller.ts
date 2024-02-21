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
  changeProjectCodeReqDto,
  runProjectCodeReqDto,
} from './dtos/project.req.dto';
import { getListResDto } from './dtos/project.res.dto';
import type { IResData } from '../index';
import type { IGetListRes } from './index';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';

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

  @ApiOperation({ summary: '获取项目代码' })
  @Get('code')
  async getCode(
    @Query('projectId', ParseIntPipe) projectId: number,
  ): Promise<IResData<string>> {
    return {
      msg: '获取代码成功',
      data: await this.projectsService.getProjectCode(projectId),
    };
  }

  @ApiOperation({ summary: '修改项目代码' })
  @Patch('code')
  async changeCode(
    @Query('projectId', ParseIntPipe) projectId: number,
    @Body() data: changeProjectCodeReqDto,
  ): Promise<IResData<UpdateResult>> {
    return {
      msg: '修改代码成功',
      data: await this.projectsService.changeProjectCode(projectId, data.code),
    };
  }

  @ApiOperation({ summary: '运行项目代码' })
  @Post('code')
  async runCode(@Body() data: runProjectCodeReqDto): Promise<IResData<any>> {
    const result = await this.projectsService.runProjectCode(
      data.code,
      data.codeType,
    );
    return {
      msg: result?.success ? '代码运行成功' : '代码运行失败',
      data: result?.data.length ? result?.data : result?.error,
    };
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
