import { ApiProperty } from '@nestjs/swagger';

export class getCaptchaDto {
  @ApiProperty({
    description: 'svg的长度(px)',
    example: 200,
    default: 200,
    required: false,
  })
  readonly width: number;

  @ApiProperty({
    description: 'svg的宽度(px)',
    example: 200,
    default: 200,
    required: false,
  })
  readonly height: number;
}
