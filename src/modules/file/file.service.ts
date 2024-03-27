import { uploadFile } from '@/utils/cos.utils';
import { getMimeType, isExistDir, touchFile } from '@/utils/fs.utile';
import { joinWorkPath } from '@/utils/joinWorkPath';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import { IMenuResItem } from '.';
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
    mimetype: IFileType | undefined,
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
    const parentFolderDb = await this.workSpaceRepository.findOneBy({
      id: parentId,
    });
    if (!parentFolderDb) return;
    const dbRes = await this.workSpaceRepository.find({
      select: [
        'id',
        'fileName',
        'updateTime',
        'isFolder',
        'parentFolder',
        'mimetype',
      ],
      where: { parentFolder: parentId, userId: this.getUserId() },
    });
    const parentFold = parentFolderDb?.fileName;

    const curMenu = joinWorkPath(parentFold);
    // DONE 扫描文件上传
    const dbFileNames = dbRes?.map((e) => e.fileName.split('\\').pop());

    const items = fs.readdirSync(curMenu);
    // console.log('🚀 ~ 开始扫描文件上传:', items, dbFileNames);

    if (dbFileNames.length !== items.length) {
      const workFiles: WorkFileEntity[] = [];
      items.forEach((e) => {
        if (!dbFileNames.includes(e)) {
          const stat = fs.statSync(path.join(curMenu, e));
          if (stat.isFile() || stat.isDirectory()) {
            const workFile = new WorkFileEntity();
            workFile.fileName = path.join(parentFolderDb!.fileName, e);
            workFile.isFolder = stat.isDirectory();
            workFile.parentFolder = parentId;
            workFile.mimetype = getMimeType(e);
            workFile.userId = this.getUserId();
            workFile.createTime = stat.birthtime;
            workFile.updateTime = stat.mtime;
            workFiles.push(workFile);
          }
        }
      });
      await this.workSpaceRepository.save(workFiles);
    }
    const data = dbRes.map((e) => {
      const t: IMenuResItem = e as IMenuResItem;
      t.name = e.fileName.split('\\').pop() || '';
      return t;
    });
    return data;
  }

  // 上传文件到工作区
  async updateFileToWork(
    file: Express.Multer.File,
    data: { fileName: string; parentId: number },
  ) {
    const workFile = new WorkFileEntity();
    const parentFolderDb = await this.workSpaceRepository.findOneBy({
      id: data.parentId,
    });
    const ext = file.originalname.split('.').pop() || '';
    workFile.fileName = path.join(
      parentFolderDb!.fileName,
      data.fileName + `.${ext}`,
    );
    workFile.isFolder = false;
    workFile.fileUrl = '';
    workFile.parentFolder = data.parentId;
    workFile.mimetype = file.mimetype as IFileType;
    workFile.userId = this.getUserId();
    fs.writeFileSync(joinWorkPath(workFile.fileName), file.buffer);
    return this.workSpaceRepository.save(workFile);
  }

  // 获取用户id
  getUserId() {
    return this.request.user!.id;
  }
}
