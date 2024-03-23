import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, MaxLength } from 'class-validator';

export enum IFileType {
  'text/html' = 'text/html',
  'image/gif' = 'image/gif',
  'image/jpeg' = 'image/jpeg',
  'image/png' = 'image/png',
  'application/x-gzip' = 'application/x-gzip',
  'application/x-tar' = 'application/x-tar',
  '' = '',
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

  @ApiProperty({
    description: '文件类型',
    example: 'image/png',
    required: false,
  })
  readonly mimetype?: IFileType;
}
