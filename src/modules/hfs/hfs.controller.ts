import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HfsService } from './hfs.service';

@Controller('hfs')
@ApiTags('HFS系统')
@ApiBearerAuth('JWT-auth')
export class HfsController {
  constructor(private readonly hfsService: HfsService) {}

  @Post('upload')
  @ApiOperation({ summary: '上传文件到工作区' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadDataSet(
    @UploadedFile() file: Express.Multer.File,
    @Body('fileName') fileName: string,
  ) {
    await this.hfsService.uploadDataSet(file, fileName);
    return { msg: '上传成功' };
  }
}
