import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from '../users/user.service';
import {
  newFileReqDto,
  newFolderReqDto,
  uploadFileReqDto,
} from './dtos/workSpace.req.dto';
import { FileService } from './file.service';

@Controller('files')
@ApiTags('文件系统')
@ApiBearerAuth('JWT-auth')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly userService: UserService,
  ) {}

  @Post('avatar')
  @ApiOperation({ summary: '上传头像' })
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    const user = await this.userService.getUser();
    const avatar = await this.fileService.uploadAvatar(user, file);
    await this.userService.updateUserAvatar(avatar);
    return { msg: '用户头像成功', data: avatar.fileUrl };
  }

  @Post('newFolder')
  @ApiOperation({ summary: '新建文件夹' })
  async newFolder(@Body() data: newFolderReqDto) {
    this.fileService.createFolderByParentId(data.foldName, data.parentId);
    return { msg: '新建文件夹成功' };
  }

  @Get('menu/:parentId')
  @ApiOperation({ summary: '获取文件夹下的目录' })
  @ApiParam({
    name: 'parentId',
    description: '父文件的id',
    required: true,
    example: '6',
  })
  async getMenu(@Param('parentId', ParseIntPipe) parentId: number) {
    if (parentId < 1) throw new HttpException('禁止获取', HttpStatus.FORBIDDEN);
    else {
      const res = await this.fileService.getFileListByParentId(parentId);
      return { msg: '获取文件夹下的目录成功', data: res };
    }
  }

  @Post('newFile')
  @ApiOperation({ summary: '新建文件' })
  async newFile(@Body() data: newFileReqDto) {
    this.fileService.createFileByParentId(
      data.fileName,
      data.parentId,
      data.mimetype,
    );
    return { msg: '新建文件成功' };
  }

  @Post('file')
  @ApiOperation({ summary: '上传文件到工作区' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: uploadFileReqDto,
  ) {
    await this.fileService.updateFileToWork(file, data);
    return { msg: '上传成功' };
  }

  @Get('cat/:fileId')
  @ApiOperation({ summary: '查看文件' })
  @ApiParam({ description: '文件的id', required: true, name: 'fileId' })
  @UseInterceptors(FileInterceptor('file'))
  async catFile(@Param('fileId', ParseIntPipe) fileId: number) {
    console.log('🚀 ~ FileController ~ catFile ~ res:', fileId);
    return { msg: '查看文件' };
  }
}
