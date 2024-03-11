import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class newFolderReqDto {
  @ApiProperty({
    description: '项目名称',
    example: 'test',
    maxLength: 12,
  })
  @IsNotEmpty({ message: '项目名称不能为空' })
  @MaxLength(12)
  readonly projectName: string;

  @ApiProperty({
    description: '父文件夹id',
    example: '0',
  })
  @IsNotEmpty({ message: '父文件夹id不能为空' })
  readonly parentId: number;
}
