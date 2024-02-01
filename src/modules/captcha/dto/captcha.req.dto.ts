import { ApiProperty } from '@nestjs/swagger';

export class getCaptchaReqDto {
  @ApiProperty({
    description: 'svg的长度(px)',
    example: 200,
    default: 200,
    required: false,
  })
  readonly width?: number;

  @ApiProperty({
    description: 'svg的宽度(px)',
    example: 200,
    default: 200,
    required: false,
  })
  readonly height?: number;
}
export class getPhoneCaptchaReqDto {
  @ApiProperty({
    description: '手机号码',
    example: 17762647331,
    default: 17762647331,
  })
  readonly phoneNum: string;
}
