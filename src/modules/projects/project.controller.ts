import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as dayjs from 'dayjs';
import { IGetListRes } from '.';
import type { IResData } from '../index';
import {
  createProjectReqDto,
  disableProjectReqDto,
  runProjectCodeReqDto,
  setProjectReqDto,
} from './dtos/project.req.dto';
import { getListResDto, getProjectCodeResDto } from './dtos/project.res.dto';
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
  ): Promise<IResData<{ projectId: number; rootWorkFoldId?: number }>> {
    const res = await this.projectService.createProject(data);
    return {
      code: 201,
      msg: '项目创建成功',
      data: { projectId: res.id, rootWorkFoldId: res.rootWorkFoldId },
    };
  }

  @ApiOperation({ summary: '获取项目列表' })
  @ApiResponse({
    status: '2XX',
    description: '系统成功响应',
    type: getListResDto,
  })
  @ApiQuery({
    name: 'page',
    description: '页码',
    required: true,
    example: 0,
  })
  @ApiQuery({
    name: 'size',
    description: '每页的数量',
    required: true,
    example: 0,
  })
  @Get('list')
  async getList(
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
  ): Promise<IResData<IGetListRes>> {
    const dbRes = await this.projectService.getList(page, size);
    const projectTotal = await this.projectService.getProjectTotal();

    return { data: { list: dbRes, total: projectTotal } };
  }

  @ApiOperation({ summary: '获取项目代码' })
  @ApiParam({
    name: 'projectId',
    description: '项目的id',
    example: '0',
    required: true,
  })
  @Get('code/:projectId')
  async getCode(
    @Param('projectId', ParseIntPipe) projectId: number,
  ): Promise<IResData<getProjectCodeResDto>> {
    return {
      msg: '获取代码成功',
      data: await this.projectService.getProjectCode(projectId),
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

  @ApiOperation({ summary: '运行项目' })
  @Post('run/:projectId')
  async runComplexCode(
    @Param('projectId', ParseIntPipe) projectId: number,
  ): Promise<IResData<any>> {
    const result = await this.projectService.runComplexProject(projectId);
    return {
      msg: '代码运行成功',
      data: result,
    };
  }

  @ApiOperation({ summary: '设置项目' })
  @ApiParam({
    name: 'projectId',
    description: '项目id',
    required: true,
    example: '0',
  })
  @Patch('set/:projectId')
  async set(
    @Body() config: setProjectReqDto,
    @Param('projectId', ParseIntPipe) projectId: number,
  ): Promise<IResData<null>> {
    await this.projectService.setProject(projectId, config);

    return { msg: '项目设置成功' };
  }
  // @ApiOperation({ summary: '修改项目代码' })
  // @ApiParam({
  //   name: 'projectId',
  //   description: '项目id',
  //   required: true,
  //   example: '0',
  // })
  // @ApiBody({
  //   type: changeProjectCodeReqDto,
  // })
  // @Patch('code/:projectId')
  // async changeCode(
  //   @Param('projectId', ParseIntPipe) projectId: number,
  //   @Body('code') code: string,
  //   @Body('code') codeLanguage?: string,
  // ): Promise<IResData<UpdateResult>> {
  //   console.log('🚀 ~ ProjectController ~ codeLanguage:', codeLanguage);
  //   return {
  //     msg: '修改代码成功',
  //     data: await this.projectService.changeProjectCode(projectId, code),
  //   };
  // }
  // @ApiOperation({ summary: '重命名项目' })
  // @ApiParam({
  //   name: 'projectId',
  //   description: '项目id',
  //   required: true,
  //   example: '0',
  // })
  // @ApiBody({
  //   type: reNameProjectReqDto,
  // })
  // @Patch('rename/:projectId')
  // async rename(
  //   @Body('newName') newName: string,
  //   @Param('projectId', ParseIntPipe) projectId: number,
  // ): Promise<IResData<null>> {
  //   await this.projectService.reName(projectId, newName);

  //   return { msg: '项目重命名成功' };
  // }

  @ApiOperation({ summary: '禁用项目(批量)' })
  @ApiBody({ type: disableProjectReqDto })
  @Patch('disable')
  async disable(
    @Body('projectIds') projectIds: number[],
    @Body('disable') disable: boolean,
  ): Promise<IResData<null>> {
    await this.projectService.setProjectDisable(projectIds, disable);

    return { msg: '项目改变禁用状态成功' };
  }

  @ApiOperation({ summary: '删除项目(批量)' })
  @ApiBody({ type: disableProjectReqDto })
  @Delete('delete')
  async delete(@Body('projectIds') projectIds: number[]) {
    const res = await this.projectService.deleteByIds(projectIds);

    return { msg: '项目删除成功', data: res };
  }
}
