import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { appResDto } from '@/modules/app-dto/app.res.dto';

export class getCaptchaResDto extends appResDto {
  @ApiProperty({
    description: '验证码',
    example: `<svg />`,
  })
  @IsNotEmpty({ message: '返回信息不能为空' })
  readonly valida: string;
}

export class getPhoneCaptchaResDto extends appResDto {
  @ApiProperty({
    description: '手机验证码',
    example: `123456`,
  })
  @IsNotEmpty({ message: '返回信息不能为空' })
  readonly data: number;
}
export class getEmailCaptchaResDto extends appResDto {
  @ApiProperty({
    description: '邮箱验证码',
    example: `123456`,
  })
  @IsNotEmpty({ message: '返回信息不能为空' })
  readonly data: number;
}
