import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectsEntity } from './entities/projects.entity';
import { REQUEST } from '@nestjs/core';
import { IReqUser } from '..';
import { UsersEntity } from '../users/entities/users.entity';

@Injectable({ scope: Scope.REQUEST })
export class ProjectsService {
  constructor(
    @Inject(REQUEST) private readonly requset: IReqUser,
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
    @InjectRepository(ProjectsEntity)
    private readonly projectRepository: Repository<ProjectsEntity>,
  ) {}
  async create(projectName: string) {
    const user = await this.getUser();

    const dbProject = await this.projectRepository.findOneBy({
      projectName,
      user,
    });
    if (dbProject) {
      throw new HttpException('该项目名已被使用', HttpStatus.FORBIDDEN);
    }
    const projct = new ProjectsEntity();
    projct.projectName = projectName;
    projct.user = user;
    this.projectRepository.save(projct);
  }

  async reName(projectName: string, newName: string) {
    const user = await this.getUser();

    const dbProject = await this.projectRepository.findOneBy({
      projectName,
      user,
    });
    if (dbProject) {
      this.projectRepository.update(dbProject.id, { projectName: newName });
    } else {
      throw new HttpException('未找到该项目', HttpStatus.FORBIDDEN);
    }
  }

  async getUser() {
    const user = await this.userRepository.findOneBy({
      id: this.requset.user?.id,
    });
    if (!user) {
      // 理论上不可能
      throw new HttpException('该用户名不存在', HttpStatus.FORBIDDEN);
    }
    return user;
  }
}
