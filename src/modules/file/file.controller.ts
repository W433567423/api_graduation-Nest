import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from '../users/user.service';
import { getFolderMenuReqDto, newFolderReqDto } from './dtos/workSpace.req.dto';
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
    this.fileService.createWorkSpaceFolder(data.projectName, data.parentId);
    return { msg: '新建文件夹成功' };
  }
  @Get('menu')
  @ApiOperation({ summary: '获取文件夹下的目录' })
  async getMenu(@Query() query: getFolderMenuReqDto) {
    const res = await this.fileService.getProjectWorkSpace(query.parentId);
    return { msg: '获取文件夹下的目录成功', data: res };
  }
}
