import type { returnRunCodeData } from '@/utils/index.d';
import { runCode, runInnerProject } from '@/utils/runCode.utils';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { io } from 'socket.io-client';
import { Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { v4 } from 'uuid';
import { IPostCreateProject } from '.';
import { IReqUser } from '..';
import { FileService } from '../file/file.service';
import { SocketsGateway } from '../sockets/sockets.gateway';
import { ProjectEntity } from './entities/project.entity';

@Injectable({ scope: Scope.REQUEST })
export class ProjectService {
  constructor(
    @Inject(REQUEST) private readonly request: IReqUser,
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    private readonly fileService: FileService,
    private readonly socketsGateway: SocketsGateway,
  ) {}
  qbProjects = this.projectRepository.createQueryBuilder('projects');
  socket = io('ws://localhost:8013');
  // 创建项目
  async createProject(createParam: IPostCreateProject) {
    await this.isExistProject(createParam.projectName, this.getUserId());

    const project = new ProjectEntity();
    project.projectName = createParam.projectName;
    project.projectType = createParam.projectType;
    project.userId = this.getUserId();
    // 简单模式
    if (project.projectType === 'simple') {
      project.codeLanguage = createParam.projectLanguage || '';
      project.code = createParam.projectCode || '';
    } else {
      const rootFolderName = `space${this.getUserId()}_${v4().split('-')[0]}`;
      const resWork = await this.fileService.createFolderByParentId(
        rootFolderName,
        0,
      );
      project.rootWorkName = rootFolderName;
      project.rootWorkFoldId = resWork.id;
      project.indexFile = createParam.indexFile;
    }
    return this.projectRepository.save(project);
  }

  // 获取项目列表
  async getList(page: number | undefined, size: number | undefined) {
    return this.qbProjects
      .select([
        'projects.id',
        'projects.rootWorkFoldId',
        'projects.projectName',
        'projects.projectType',
        'projects.disable',
        'projects.lastStatus',
        'projects.createTime',
        'projects.updateTime',
      ])
      .where('userId= :userId', { userId: this.getUserId() })
      .limit(size)
      .offset(page)
      .getMany();
  }

  // 获取项目代码
  async getProjectCode(projectId: number) {
    const dbResult = await this.projectRepository
      .createQueryBuilder('projects')
      .where({ id: projectId })
      .andWhere({ userId: this.getUserId() })
      .getOne();

    return {
      projectName: dbResult?.projectName,
      code: dbResult?.code || '',
    };
  }

  // DONE 运行项目代码
  async runProjectCode(
    projectId: number,
    code: string,
    type: string,
  ): Promise<returnRunCodeData> {
    const runResult = await runCode(code, type);
    if (runResult.success) {
      // 运行成功，保存代码
      await this.projectRepository.update(projectId, {
        code,
        lastStatus: 1,
      });
    } else {
      await this.projectRepository.update(projectId, {
        lastStatus: -1,
      });
    }

    return runResult;
  }

  // 运行项目
  async runComplexProject(projectId: number) {
    const dbProject = await this.qbProjects
      .where('id= :id', {
        id: projectId,
      })
      .andWhere('userId= :userId', {
        userId: this.getUserId(),
      })
      .getOne();
    if (!dbProject) {
      throw new HttpException('未找到该项目', HttpStatus.NOT_FOUND);
    } else {
      // const indexFile = 'script.py';
      const cb = this.socketsGateway.sendMessageToClient.bind(
        this.socketsGateway,
      );
      const res = await runInnerProject(cb, dbProject.indexFile!);
      return res;
    }
  }

  // 删除项目
  async deleteByIds(ids: number[]) {
    return await this.qbProjects
      .where('userId = :userId', { userId: this.getUserId() })
      .andWhere('id IN (:ids)', { ids })
      .delete()
      .execute();
  }

  // 设置禁用状态
  async setProjectDisable(ids: number[], disable: boolean) {
    return await this.projectRepository
      .createQueryBuilder()
      .update(ProjectEntity)
      .set({ disable: disable })
      .where('userId = :userId', { userId: this.getUserId() })
      .andWhere('id IN (:ids)', { ids })
      .execute();
  }

  // 设置项目
  async setProject(
    projectId: number,
    config: QueryDeepPartialEntity<ProjectEntity>,
  ) {
    const dbProject = await this.projectRepository.findOneBy({
      id: projectId,
      userId: this.getUserId(),
    });
    if (dbProject) {
      this.projectRepository.update(projectId, config);
    } else {
      throw new HttpException('禁止修改他人项目!', HttpStatus.FORBIDDEN);
    }
  }
  // 获取项目总数
  async getProjectTotal() {
    return this.projectRepository.countBy({ userId: this.getUserId() });
  }

  // 通过id获取项目
  async getProjectById(id: number) {
    return this.projectRepository.findOneBy({ id, userId: this.getUserId() });
  }

  getUserId() {
    return this.request.user!.id;
  }
  // 判断项目名是否被使用
  async isExistProject(projectName: string, userId: number) {
    const dbProject = await this.projectRepository.findOneBy({
      projectName,
      userId,
    });
    if (dbProject) {
      throw new HttpException('该项目名已被使用', HttpStatus.FORBIDDEN);
    }
  }
}
