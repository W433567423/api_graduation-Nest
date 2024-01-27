import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RegistryUserDto {
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
