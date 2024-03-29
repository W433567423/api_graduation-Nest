import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class peaceLoginReqDto {
  @ApiProperty({ description: '用户名', example: 'admin' })
  @IsNotEmpty({ message: '用户名不能为空' })
  readonly username: string;

  @ApiProperty({ description: '密码', example: '333333' })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string;

  @ApiProperty({ description: '动态码', example: 333333 })
  @IsNotEmpty({ message: '动态码不能为空' })
  readonly code: number;
}

export class peacePostReqDto {
  @ApiProperty({ description: '链接', example: '/api' })
  @IsNotEmpty({ message: '链接不能为空' })
  readonly url: string;

  @ApiProperty({ description: '请求的data参数', example: '/api' })
  readonly data?: any;
}
