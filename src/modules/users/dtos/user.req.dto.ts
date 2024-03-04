import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
export class userDefaultReqDto {
  @ApiProperty({ description: '用户名', example: 'test' })
  @IsNotEmpty({ message: '用户名不能为空' })
  readonly username: string;
}

export class userRegistryReqDto extends userDefaultReqDto {
  @ApiProperty({
    description: '密码',
    example: '666666',
  })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly password: string;

  @ApiProperty({
    description: '邮箱验证码',
    example: '333333',
  })
  @IsNotEmpty({ message: '邮箱验证码不能为空' })
  readonly emailValid: string;

  @ApiProperty({
    description: '邮箱',
    example: 't433567423@163.com',
  })
  @IsEmail()
  @IsNotEmpty({ message: '邮箱不能为空' })
  readonly emailNum: string;
}

export class userLoginReqDto extends userDefaultReqDto {
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
  readonly valid: string;
}

export class userForgetPasswordReqDto {
  @ApiProperty({
    description: '邮箱验证码',
    example: '333333',
  })
  @IsNotEmpty({ message: '邮箱验证码不能为空' })
  readonly emailValid: string;

  @ApiProperty({
    description: '邮箱',
    example: 't433567423@163.com',
  })
  @IsEmail()
  @IsNotEmpty({ message: '邮箱不能为空' })
  readonly emailNum: string;

  @ApiProperty({
    description: '密码',
    example: '666666',
  })
  @IsNotEmpty({ message: '密码不能为空' })
  readonly newPassword: string;
}
