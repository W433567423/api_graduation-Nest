import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileService } from './file.service';

@Controller('file')
@ApiTags('文件系统')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    // private readonly userService: UserService,
  ) {}

  @Post('avatar')
  @ApiOperation({ summary: '上传头像' })
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar() {
    // @UploadedFile() avatar: Express.Multer.File,
    // console.log('🚀 ~ FileController ~ avatar:', avatar);
    // return await this.fileService.uploadAvatar();
  }
}
