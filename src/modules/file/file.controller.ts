import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from '../users/user.service';
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
    return 'ok';
    // @UploadedFile() avatar: Express.Multer.File,
    // console.log('🚀 ~ FileController ~ avatar:', avatar);
    // return await this.fileService.uploadAvatar();
  }
}
