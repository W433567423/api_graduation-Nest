import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { successResDto } from '@/modules/app-dto/app.res.dto';

export class getCaptchaResDto extends successResDto<string> {
  @ApiProperty({
    description: '验证码',
    example: `<svg />`,
  })
  @IsNotEmpty({ message: '返回信息不能为空' })
  readonly valida: string;
}

export class getPhoneCaptchaResDto extends successResDto<number> {
  @ApiProperty({
    description: '手机验证码',
    example: `123456`,
  })
  @IsNotEmpty({ message: '返回信息不能为空' })
  readonly data: number;
}
export class getEmailCaptchaResDto extends successResDto<number> {
  @ApiProperty({
    description: '邮箱验证码',
    example: `123456`,
  })
  @IsNotEmpty({ message: '返回信息不能为空' })
  readonly data: number;
}
