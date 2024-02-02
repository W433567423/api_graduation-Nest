import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone, IsNotEmpty } from 'class-validator';
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
    description: '手机验证码',
    example: 'tutu',
  })
  @IsNotEmpty({ message: '手机验证码不能为空' })
  readonly phoneValida: string;

  @ApiProperty({
    description: '手机号',
    example: 17762647331,
  })
  @IsMobilePhone('zh-CN')
  @IsNotEmpty({ message: '手机号不能为空' })
  readonly phoneNum: string;
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
  readonly valida: string;
}

export class userforgetPasswordReqDto {
  @ApiProperty({
    description: '验证码',
    example: 'tutu',
  })
  @IsNotEmpty({ message: '验证码不能为空' })
  readonly valida: string;

  @ApiProperty({
    description: '手机号',
    example: 17762647331,
  })
  @IsMobilePhone('zh-CN')
  @IsNotEmpty({ message: '手机号不能为空' })
  readonly phoneNum: string;

  @ApiProperty({
    description: '手机验证码',
    example: 'tutu',
  })
  @IsNotEmpty({ message: '手机验证码不能为空' })
  readonly phoneValida: string;
}
