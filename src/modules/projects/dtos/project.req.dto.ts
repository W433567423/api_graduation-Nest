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
    maxLength: 12,
  })
  @IsNotEmpty({ message: '项目名称不能为空' })
  @MaxLength(12)
  readonly projectName: string;
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
    maximum: 12,
    example: 'new test',
  })
  @IsNotEmpty({ message: '项目名称不能为空' })
  @MaxLength(12)
  readonly newName: string;
}

export class deleteProjectReqDto {
  @ApiProperty({
    description: '项目的id',
    example: '0',
  })
  @IsNotEmpty({ message: '项目的id不能为空' })
  readonly projectId: number;
}
