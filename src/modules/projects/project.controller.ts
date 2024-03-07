import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as dayjs from 'dayjs';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import type { IResData } from '../index';
import {
  changeProjectCodeReqDto,
  createProjectReqDto,
  deleteProjectReqDto,
  disableProjectReqDto,
  getListReqDto,
  reNameProjectReqDto,
  runProjectCodeReqDto,
} from './dtos/project.req.dto';
import { getListResDto, getProjectCodeResDto } from './dtos/project.res.dto';
import type { IGetListRes } from './index';
import { ProjectService } from './project.service';

@ApiTags('项目管理')
@ApiBearerAuth('JWT-auth')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiOperation({ summary: '创建项目' })
  @Post('create')
  async create(
    @Body() data: createProjectReqDto,
  ): Promise<IResData<{ projectId: number }>> {
    const { id } = (await this.projectService.create(data)) as any;

    return { code: 201, msg: '项目创建成功', data: { projectId: id } };
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
    const dbRes = await this.projectService.getList(page, size);
    const projectTotal = await this.projectService.getProjectTotal();

    return { data: { list: dbRes, total: projectTotal } };
  }

  @ApiOperation({ summary: '获取项目代码' })
  @Get('code')
  async getCode(
    @Query('projectId', ParseIntPipe) projectId: number,
  ): Promise<IResData<getProjectCodeResDto>> {
    return {
      msg: '获取代码成功',
      data: await this.projectService.getProjectCode(projectId),
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
      data: await this.projectService.changeProjectCode(projectId, data.code),
    };
  }

  @ApiOperation({ summary: '运行项目代码' })
  @Post('code')
  async runCode(
    @Query('projectId', ParseIntPipe) projectId: number,
    @Body() data: runProjectCodeReqDto,
  ): Promise<IResData<any>> {
    const result = await this.projectService.runProjectCode(
      projectId,
      data.code,
      data.codeLanguage,
    );
    return {
      msg: result.success ? '代码运行成功' : '代码运行失败',
      data: {
        codeStatus: result.success,
        codeResult: result?.data.length ? result?.data : result?.error,
        codeRunDate: dayjs().format('YYYY/MM/DD HH:mm:ss'),
      },
    };
  }

  @ApiOperation({ summary: '重命名项目' })
  @Patch('rename')
  async auth(@Body() data: reNameProjectReqDto): Promise<IResData<null>> {
    await this.projectService.reName(data.projectId, data.newName);

    return { msg: '项目重命名成功' };
  }

  @ApiOperation({ summary: '禁用项目' })
  @Patch('disable')
  async disable(@Body() data: disableProjectReqDto): Promise<IResData<null>> {
    await this.projectService.setProjectDisable(data.projectIds, data.disable);

    return { msg: '项目改变禁用状态成功' };
  }

  @ApiOperation({ summary: '删除项目' })
  @Delete('delete')
  async delete(@Body() data: deleteProjectReqDto): Promise<IResData<null>> {
    await this.projectService.deleteByIds(data.projectIds);

    return { msg: '项目删除成功' };
  }
}
