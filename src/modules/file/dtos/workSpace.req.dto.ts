import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, MaxLength, Min } from 'class-validator';

export enum IFileType {
  'text/html',
  'text/plain',
  'application/rtf',
  'image/gif',
  'image/jpeg',
  'audio/basic',
  'audio/midi',
  'audio/x-midi',
  'audio/x-pn-realaudio',
  'video/mpeg',
  'video/x-msvideo',
  'application/x-gzip',
  'application/x-tar',
  '',
}

export class newFolderReqDto {
  @ApiProperty({
    description: '文件夹名称',
    example: 'test',
    maxLength: 20,
  })
  @IsNotEmpty({ message: '文件夹名称不能为空' })
  @MaxLength(20)
  readonly foldName: string;

  @ApiProperty({
    description: '父文件夹id',
    example: '0',
  })
  @IsNotEmpty({ message: '父文件夹id不能为空' })
  readonly parentId: number;
}

export class getFolderMenuReqDto {
  @ApiProperty({
    description: '父文件夹id',
    example: '1',
  })
  @IsNotEmpty({ message: '父文件夹id不能为空' })
  @IsNumberString({}, { message: '必须是数字' })
  @Min(1)
  readonly parentId: string;
}

export class newFileReqDto {
  @ApiProperty({
    description: '文件夹/文件名称',
    example: 'test',
    maxLength: 20,
  })
  @IsNotEmpty({ message: '文件夹/文件名称不能为空' })
  @MaxLength(20)
  readonly fileName: string;

  @ApiProperty({
    description: '父文件夹id',
    example: '0',
  })
  @IsNotEmpty({ message: '父文件夹id不能为空' })
  readonly parentId: number;

  @ApiProperty({
    description: '内容',
    example: 'tutu is boy',
    required: false,
  })
  readonly content?: number;
}
