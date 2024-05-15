import { NoAuth } from '@/global/decorator';
import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HfsService } from './hfs.service';

@Controller('hfs')
@ApiTags('HFS系统')
export class HfsController {
  constructor(private readonly hfsService: HfsService) {}

  @Post('upload')
  @ApiOperation({ summary: '上传数据集' })
  @UseInterceptors(FileInterceptor('file'))
  @NoAuth()
  async uploadDataSet(
    @UploadedFile() file: Express.Multer.File,
    @Body('fileName') fileName: string,
  ) {
    // await this.hfsService.uploadDataSet(file, fileName);
    console.log(file, fileName);
    return { msg: '上传成功' };
  }
}
