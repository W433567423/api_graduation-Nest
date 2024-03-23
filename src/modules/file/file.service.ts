import { uploadFile } from '@/utils/cos.utils';
import { isExistDir, touchFile } from '@/utils/fs.utile';
import { joinWorkPath } from '@/utils/joinWorkPath';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import { IReqUser } from '..';
import { UserEntity } from '../users/entities/user.entity';
import { IFileType } from './dtos/workSpace.req.dto';
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
  async createFolderByParentId(folderName: string, fileParentId = 0) {
    const parentFolderDb = await this.workSpaceRepository.findOneBy({
      id: fileParentId,
    });
    const file = new WorkFileEntity();
    file.fileName = path.join(parentFolderDb?.fileName || '', folderName);
    file.parentFolder = fileParentId;
    file.isFolder = true;
    file.userId = this.getUserId();
    // 新建实体文件夹
    isExistDir(joinWorkPath(file.fileName));
    return this.workSpaceRepository.save(file);
  }

  // 新建工作区文件
  async createFileByParentId(
    fileName: string,
    fileParentId = 0,
    mimetype?: IFileType,
  ) {
    const parentFolderDb = await this.workSpaceRepository.findOneBy({
      id: fileParentId,
    });
    const file = new WorkFileEntity();
    file.fileName = path.join(parentFolderDb!.fileName, fileName);
    file.mimetype = mimetype || IFileType[''];
    file.parentFolder = fileParentId;
    file.isFolder = false;
    file.userId = this.getUserId();

    // 新建实体文件
    await touchFile(joinWorkPath(file.fileName));
    return this.workSpaceRepository.save(file);
  }

  // 获取项目工作区目录
  async getFileListByParentId(parentId: number) {
    console.log(
      '🚀 ~ FileService ~ getFileListByParentId ~ parentId:',
      parentId,
    );
    const dbRes = await this.workSpaceRepository.find({
      select: ['id', 'fileName', 'updateTime', 'isFolder', 'parentFolder'],
      where: { parentFolder: parentId, userId: this.getUserId() },
    });
    dbRes.forEach((e) => {
      e.fileName = e.fileName.split('\\').pop() || '';
      return e;
    });
    return dbRes;
  }
  getUserId() {
    return this.request.user!.id;
  }
}
