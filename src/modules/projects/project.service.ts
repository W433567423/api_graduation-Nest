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
import { IPostCreateProject } from '.';
import { IReqUser } from '..';
import { UserEntity } from '../users/entities/user.entity';
import { ProjectEntity } from './entities/project.entity';

@Injectable({ scope: Scope.REQUEST })
export class ProjectService {
  constructor(
    @Inject(REQUEST) private readonly request: IReqUser,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
  ) {}
  // 创建项目
  async create(createParam: IPostCreateProject) {
    const user = await this.getUser();

    await this.isExistProject(createParam.projectName, user);

    const project = new ProjectEntity();
    project.projectName = createParam.projectName;
    project.projectType = createParam.projectType;
    project.codeLanguage = createParam.projectLanguage || '';
    project.code = createParam.projectCode || '';
    project.user = user;
    return this.projectRepository.save(project);
  }

  // 获取项目列表
  async getList(page: number | undefined, size: number | undefined) {
    const user = await this.getUser();
    if (page === undefined && size === undefined) {
      return this.projectRepository.find({
        select: [
          'id',
          'projectName',
          'createTime',
          'updateTime',
          'disable',
          'lastStatus',
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
          'lastStatus',
        ],
        where: { user },
      });
    }
  }

  // 获取项目代码
  async getProjectCode(projectId: number) {
    const user = await this.getUser();
    const dbResult = await this.projectRepository.find({
      select: ['code', 'projectName'],
      where: { id: projectId, user },
    });
    return {
      projectName: dbResult?.[0].projectName,
      code: dbResult?.[0]?.code || 'none code',
    };
  }

  // 修改项目代码
  async changeProjectCode(projectId: number, code: string) {
    const user = await this.getUser();
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
    await this.getUser();
    const runResult = await runCode(code, type);
    console.log('🚀 ~ ProjectService ~ runProjectCode ~ runResult:', runResult);
    if (runResult.success) {
      // 运行成功，保存代码
      await this.projectRepository.update(projectId, { code });
    }

    return runResult;
  }

  // 重命名项目
  async reName(projectId: number, newName: string) {
    const user = await this.getUser();

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
    const user = await this.getUser();
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
    const user = await this.getUser();

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
    const user = await this.getUser();
    return await this.projectRepository.countBy({ user });
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

  // 获取用户
  async getUser() {
    const user = await this.userRepository.findOneBy({
      id: this.request.user?.id,
    });
    if (!user) {
      // 理论上不可能
      throw new HttpException('该用户名不存在', HttpStatus.FORBIDDEN);
    }
    return user;
  }
}
