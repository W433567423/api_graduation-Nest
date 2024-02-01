import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class userRegistryReqDto {
  @ApiProperty({ description: '用户名', example: 'test' })
  @IsNotEmpty({ message: '用户名不能为空' })
  readonly username: string;

  @ApiProperty({
    description: '密码',
    example: '666666',
  })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string;

  @ApiProperty({
    description: '验证码',
    example: 'tutu',
  })
  @IsNotEmpty({ message: '验证码不能为空' })
  readonly valida: string;

  @ApiProperty({
    description: '手机号',
    example: '17700000000',
  })
  @IsNotEmpty({ message: '手机号不能为空' })
  readonly phoneNum: string;
}

export class userLoginReqDto {
  @ApiProperty({ description: '用户名', example: 'test' })
  @IsNotEmpty({ message: '用户名不能为空' })
  readonly username: string;

  @ApiProperty({
    description: '密码',
    example: '666666',
  })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string;

  @ApiProperty({
    description: '验证码',
    example: 'tutu',
  })
  @IsNotEmpty({ message: '验证码不能为空' })
  readonly valida: string;
}
