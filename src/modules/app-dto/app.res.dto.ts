import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class successResDto<T> {
  @ApiProperty({ description: '状态码', example: '200' })
  @IsNotEmpty({ message: '状态码不能为空' })
  readonly code: number;

  @ApiProperty({
    description: '返回的信息',
    example: '请求成功',
  })
  @IsNotEmpty({ message: '返回信息不能为空' })
  readonly msg: string;

  @ApiProperty({
    description: '返回的数据',
    example: 'ok',
    required: false,
  })
  readonly data?: T;
}
