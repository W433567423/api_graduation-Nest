import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, MaxLength } from 'class-validator';
export class userDefaultReqDto {
  @ApiProperty({ description: '用户名', example: 'test' })
  @IsNotEmpty({ message: '用户名不能为空' })
  readonly username: string;
}

export class createProjectReqDto {
  @ApiProperty({
    description: '项目名称',
    example: 'test',
    maxLength: 20,
  })
  @IsNotEmpty({ message: '项目名称不能为空' })
  @MaxLength(20)
  readonly projectName: string;

  @ApiProperty({
    description: '项目类型',
    example: 'simple',
    enum: ['simple', 'complex'],
  })
  @IsNotEmpty({ message: '项目类型不能为空' })
  readonly projectType: string;

  @ApiProperty({
    description: '项目语言',
    example: 'JavaScript',
    required: false,
  })
  readonly projectLanguage?: string;

  @ApiProperty({
    description: '项目源码',
    example: 'console.log(1)',
    required: false,
  })
  readonly projectCode?: string;
}

export class getListReqDto {
  @ApiProperty({
    description: '页码',
    example: 0,
    minimum: 0,
  })
  @IsNumberString()
  readonly page: number;

  @ApiProperty({
    description: '每页数量',
    example: 10,
    minimum: 1,
  })
  @IsNumberString()
  readonly size: number;
}

export class reNameProjectReqDto {
  @ApiProperty({
    description: '项目的id',
    example: '0',
  })
  @IsNotEmpty({ message: '项目的id不能为空' })
  readonly projectId: number;

  @ApiProperty({
    description: '新项目名称',
    maximum: 20,
    example: 'new test',
  })
  @IsNotEmpty({ message: '项目名称不能为空' })
  @MaxLength(20)
  readonly newName: string;
}

export class deleteProjectReqDto {
  @ApiProperty({
    description: '项目的id数组',
    example: [0],
  })
  @IsNotEmpty({ message: '项目的id数组不能为空' })
  readonly projectIds: number[];
}

export class changeProjectCodeReqDto {
  @ApiProperty({
    description: '项目的代码(仅简单模式)',
    example: 'console.log(1)',
  })
  @IsNotEmpty({ message: '代码内容不能为空' })
  readonly code: string;

  @ApiProperty({
    description: '代码语言',
    example: 'javascript',
    default: 'javascript',
    required: false,
  })
  readonly codeLanguage?: string;
}

export class runProjectCodeReqDto extends changeProjectCodeReqDto {
  @ApiProperty({
    description: '代码语言',
    example: 'javascript',
    default: 'javascript',
    required: true,
  })
  @IsNotEmpty({ message: '代码语言不能为空' })
  readonly codeLanguage: string;
}

export class disableProjectReqDto {
  @ApiProperty({
    description: '项目的ids',
    example: [0],
  })
  @IsNotEmpty({ message: '项目的ids不能为空' })
  readonly projectIds: number[];

  @ApiProperty({
    description: '项目的禁用状态',
    example: true,
  })
  @IsNotEmpty({ message: '项目的禁用状态不能为空' })
  readonly disable: boolean;
}
