import { UserService } from '@/modules/users/user.service';
import { uploadFile } from '@/utils/cos.utils';
import { isExistDir } from '@/utils/fs.utile';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import { IReqUser } from '..';
import { UserEntity } from '../users/entities/user.entity';
import { AvatarsEntity } from './entities/avatar.entity';
import { WorkFileEntity } from './entities/workSpace.entity';

@Injectable({ scope: Scope.REQUEST })
export class FileService {
  constructor(
    @Inject(REQUEST) private readonly request: IReqUser,
    @InjectRepository(AvatarsEntity)
    private readonly avatarRepository: Repository<AvatarsEntity>,
    @InjectRepository(WorkFileEntity)
    private readonly workSpaceRepository: Repository<WorkFileEntity>,
    private readonly userService: UserService,
    // private readonly projectService: ProjectService,
  ) {}
  // 上传用户头像
  async uploadAvatar(user: UserEntity, file: Express.Multer.File) {
    // 上传到cos
    const filePath = path.resolve(
      `src/../.uploads/${String(user.id)}_${String(file.fieldname)}`,
    );

    const uploadPath = 'src/../.uploads';
    isExistDir(uploadPath);

    fs.writeFileSync(filePath, file.buffer);
    const { Location } = (await uploadFile({
      Key: `graduation/avatar/${user.id}-avatar.png`,
      FilePath: filePath,
    })) as any;
    fs.rmSync(filePath);

    const dbAvatar = await this.avatarRepository.findOne({
      where: {
        fileUrl: Location,
      },
    });
    if (dbAvatar) {
      // 更新数据库中的数据
      dbAvatar.size = String(file.size) + 'bit';
      dbAvatar.mimetype = file.mimetype;
      dbAvatar.fileUrl = Location;
      await this.avatarRepository.update(dbAvatar.id, dbAvatar);
      return dbAvatar;
    } else {
      // new avatar实体
      const avatar = new AvatarsEntity();
      avatar.size = String(file.size) + 'bit';
      avatar.mimetype = file.mimetype;
      avatar.fileUrl = Location;

      return await this.avatarRepository.save(avatar);
    }
  }

  // 新建工作区目录
  async createWorkSpaceFolder(folderName: string, fileParentId = 0) {
    const file = new WorkFileEntity();
    file.fileName = folderName;
    file.parentFolder = fileParentId;
    file.isFolder = true;
    file.user = await this.userService.getUser();
    return this.workSpaceRepository.save(file);
  }

  // 获取项目工作区目录
  async getProjectWorkSpace(rootDirId: number) {
    console.log(
      '🚀 ~ FileService ~ getProjectWorkSpace ~ rootDirId:',
      rootDirId,
    );
    return this.workSpaceRepository.find({
      select: ['id', 'fileName', 'updateTime', 'isFolder', 'parentFolder'],
      where: { parentFolder: rootDirId },
    });
  }
}
