import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';
export class userDefaultReqDto {
  @ApiProperty({ description: '用户名', example: 'test' })
  @IsNotEmpty({ message: '用户名不能为空' })
  readonly username: string;
}

export class createProjectReqDto {
  @ApiProperty({
    description: '项目名称',
    example: 'test',
  })
  @IsNotEmpty({ message: '项目名称不能为空' })
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
    description: '旧项目名称',
    example: 'test',
  })
  @IsNotEmpty({ message: '项目名称不能为空' })
  readonly projectName: string;

  @ApiProperty({
    description: '新项目名称',
    example: 'new test',
  })
  @IsNotEmpty({ message: '项目名称不能为空' })
  readonly newName: string;
}
