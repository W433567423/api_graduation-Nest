import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class uploadAvatarReqDto {
  @ApiProperty({ description: '头像图片的文件' })
  @IsNotEmpty({ message: '用户名不能为空' })
  readonly avatar: Express.Multer.File;
}
