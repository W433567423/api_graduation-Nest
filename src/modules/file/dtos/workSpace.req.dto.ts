import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

enum IFileType {
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
}

export class newFolderReqDto {
  @ApiProperty({
    description: '文件夹/文件名称',
    example: 'test',
    maxLength: 20,
  })
  @IsNotEmpty({ message: '文件夹/文件名称不能为空' })
  @MaxLength(20)
  readonly fileName: string;

  @ApiProperty({
    description: '父文件夹名称',
    example: '0',
  })
  @IsNotEmpty({ message: '父文件夹名称不能为空' })
  readonly parentFold: string;
}

export class getFolderMenuReqDto {
  @ApiProperty({
    description: '父文件夹名称',
    example: '0',
  })
  @IsNotEmpty({ message: '父文件夹名称不能为空' })
  readonly parentFold: string;
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
    description: '父文件夹名称',
    example: '0',
  })
  @IsNotEmpty({ message: '父文件夹名称不能为空' })
  readonly parentFold: string;

  @ApiProperty({
    description: '内容',
    example: 'tutu is boy',
    required: false,
  })
  readonly content?: number;

  @ApiProperty({
    description: '文件的 MIME 类型',
    example: 'image/jpeg',
    required: false,
  })
  readonly mimetype?: IFileType;
}
