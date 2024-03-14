import type { returnRunCodeData } from '@/utils/index.d';
import { runCode } from '@/utils/runCode.utils';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { IPostCreateProject } from '.';
import { IReqUser } from '..';
import { FileService } from '../file/file.service';
import { UserEntity } from '../users/entities/user.entity';
import { UserService } from '../users/user.service';
import { ProjectEntity } from './entities/project.entity';
@Injectable({ scope: Scope.REQUEST })
export class ProjectService {
  constructor(
    @Inject(REQUEST) private readonly request: IReqUser,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {}
  // 创建项目
  async createProject(createParam: IPostCreateProject) {
    const user = await this.userService.getUser();

    await this.isExistProject(createParam.projectName, user);

    const project = new ProjectEntity();
    project.projectName = createParam.projectName;
    project.projectType = createParam.projectType;
    project.codeLanguage = createParam.projectLanguage || '';
    project.code = createParam.projectCode || '';
    project.user = user;
    if (project.projectType === 'complex') {
      // 创建工作目录
      const rootFolderName = `space${user.id}_${v4().split('-')[0]}`;
      const workspace = await this.fileService.createWorkSpaceFolder(
        rootFolderName,
        0,
      );
      project.rootWorkId = workspace.id;
    }
    return this.projectRepository.save(project);
  }

  // 获取项目列表
  async getList(page: number | undefined, size: number | undefined) {
    const user = await this.userService.getUser();
    if (page === undefined && size === undefined) {
      return this.projectRepository.find({
        select: [
          'id',
          'projectName',
          'createTime',
          'updateTime',
          'disable',
          'lastStatus',
          'projectType',
        ],
        where: { user },
      });
      // return this.projectRepository.findAndCountBy({ user });
    } else {
      return this.projectRepository.find({
        skip: page,
        take: size,
        select: [
          'id',
          'projectName',
          'createTime',
          'updateTime',
          'disable',
          'projectType',
          'lastStatus',
          'rootWorkId',
        ],
        where: { user },
      });
    }
  }

  // 获取项目代码
  async getProjectCode(projectId: number) {
    const user = await this.userService.getUser();
    const dbResult = await this.projectRepository
      .createQueryBuilder('projects')
      .where({ id: projectId })
      .andWhere({ user: user })
      .getOne();

    return {
      projectName: dbResult?.projectName,
      code: dbResult?.code || 'none code',
    };
  }

  // 修改项目代码
  async changeProjectCode(projectId: number, code: string) {
    const user = await this.userService.getUser();
    console.log(projectId, code);

    const dbProject = await this.projectRepository.findOneBy({
      id: projectId,
      user,
    });
    if (dbProject) {
      return await this.projectRepository.update(dbProject.id, { code });
    } else {
      throw new HttpException('未找到该项目', HttpStatus.NO_CONTENT);
    }
  }
  // 运行项目代码
  async runProjectCode(
    projectId: number,
    code: string,
    type: string,
  ): Promise<returnRunCodeData> {
    await this.userService.getUser();
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

  // 重命名项目
  async reName(projectId: number, newName: string) {
    const user = await this.userService.getUser();

    const dbProject = await this.projectRepository.findOneBy({
      id: projectId,
      user,
    });
    if (dbProject) {
      await this.isExistProject(newName, user);
      this.projectRepository.update(dbProject.id, { projectName: newName });
    } else {
      throw new HttpException('未找到该项目', HttpStatus.NO_CONTENT);
    }
  }

  // 删除项目
  async deleteByIds(ids: number[]) {
    const user = await this.userService.getUser();
    const qb = this.projectRepository.createQueryBuilder('project');
    return await qb
      .createQueryBuilder()
      .delete()
      .from(ProjectEntity)
      .where('userId = :userId', { userId: user.id })
      .andWhere('id IN (:ids)', { ids })
      .execute();
  }

  // 设置禁用状态
  async setProjectDisable(ids: number[], disable: boolean) {
    const user = await this.userService.getUser();

    return await this.projectRepository
      .createQueryBuilder()
      .update(ProjectEntity)
      .set({ disable: disable })
      .where('userId = :userId', { userId: user.id })
      .andWhere('id IN (:ids)', { ids })
      .execute();
  }

  // 设置运行状态
  async setProjectStatus(user: UserEntity, projectId: number, status: number) {
    const dbProject = await this.projectRepository.findOneBy({
      id: projectId,
      user,
    });
    if (dbProject) {
      this.projectRepository.update(projectId, { lastStatus: status });
    } else {
      throw new HttpException('禁止修改他人项目!', HttpStatus.FORBIDDEN);
    }
  }
  // 设置运行状态
  async getProjectTotal() {
    const user = await this.userService.getUser();
    return this.projectRepository.countBy({ user });
  }

  // 通过id获取项目
  async getProjectById(id: number) {
    return this.projectRepository.findOneBy({ id });
  }

  // 判断项目名是否被使用
  async isExistProject(projectName: string, user: UserEntity) {
    const dbProject = await this.projectRepository.findOneBy({
      projectName,
      user,
    });
    if (dbProject) {
      throw new HttpException('该项目名已被使用', HttpStatus.FORBIDDEN);
    }
  }
}
