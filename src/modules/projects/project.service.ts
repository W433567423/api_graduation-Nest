import { touchFile } from '@/utils/fs.utile';
import type { returnRunCodeData } from '@/utils/index.d';
import { joinWorkPath } from '@/utils/joinWorkPath';
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
import * as fs from 'fs';
import { join } from 'path';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { IPostCreateProject } from '.';
import { IReqUser } from '..';
import { IFileType } from '../file/dtos/workSpace.req.dto';
import { FileService } from '../file/file.service';
import { UserEntity } from '../users/entities/user.entity';
import { ProjectEntity } from './entities/project.entity';
@Injectable({ scope: Scope.REQUEST })
export class ProjectService {
  constructor(
    @Inject(REQUEST) private readonly request: IReqUser,
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    private readonly fileService: FileService,
  ) {}
  qbProjects = this.projectRepository.createQueryBuilder('projects');
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
      if (!createParam.workIndexFile) {
        throw new HttpException('复杂项目必须创建入口', HttpStatus.FORBIDDEN);
      } else {
        const rootFolderName = `space${this.getUserId()}_${v4().split('-')[0]}`;
        await fs.promises.mkdir(joinWorkPath(rootFolderName), {
          recursive: true,
        });
        const resWork = await this.fileService.createFolderByParentId(
          rootFolderName,
          0,
        );
        project.rootWorkName = rootFolderName;
        project.rootWorkFoldId = resWork.id;
        // DONE 创建入口文件
        await touchFile(
          join(joinWorkPath(rootFolderName), createParam.workIndexFile),
        );
        await this.fileService.createFileByParentId(
          join(rootFolderName, createParam.workIndexFile),
          resWork.id,
          IFileType[''],
        );
        project.workIndexFile = createParam.workIndexFile;
      }
    }
    return this.projectRepository.save(project);
  }

  // 获取项目列表
  async getList(page: number | undefined, size: number | undefined) {
    console.log('🚀 ~ ProjectService ~ getList ~ size:', size);
    console.log('🚀 ~ ProjectService ~ getList ~ page:', page);
    return this.qbProjects
      .select([
        'projects.id',
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
      code: dbResult?.code || 'none code',
    };
  }

  // 修改项目代码
  async changeProjectCode(projectId: number, code: string) {
    const dbProject = await this.projectRepository.findOneBy({
      id: projectId,
      userId: this.getUserId(),
    });
    if (dbProject) {
      return await this.projectRepository.update(dbProject.id, { code });
    } else {
      throw new HttpException('未找到该项目', HttpStatus.NOT_FOUND);
    }
  }
  // 运行项目代码
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
      const workFoldPath = joinWorkPath(dbProject.rootWorkName);
      const indexFile = 'script.py';
      const res = await runInnerProject(workFoldPath, indexFile);
      return res;
    }
  }

  // 重命名项目
  async reName(projectId: number, newName: string) {
    const dbProject = await this.projectRepository.findOneBy({
      id: projectId,
      userId: this.getUserId(),
    });
    if (dbProject) {
      await this.isExistProject(newName, this.getUserId());
      this.projectRepository.update(dbProject.id, { projectName: newName });
    } else {
      throw new HttpException('未找到该项目', HttpStatus.NOT_FOUND);
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

  // 设置运行状态
  async setProjectStatus(user: UserEntity, projectId: number, status: number) {
    const dbProject = await this.projectRepository.findOneBy({
      id: projectId,
      userId: this.getUserId(),
    });
    if (dbProject) {
      this.projectRepository.update(projectId, { lastStatus: status });
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
