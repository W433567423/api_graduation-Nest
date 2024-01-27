import { ApiProperty } from '@nestjs/swagger';
import { SERVER_PORT, swaggerPrefix } from '@/config';
import { IsNotEmpty } from 'class-validator';

export class CreateAppDto {
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
    example: `<h1>hallo, this is tutu の graduation</h1><hr/><li>the swagger address is <a href="http://localhost:${SERVER_PORT}/${swaggerPrefix}">localhost:${SERVER_PORT}/${swaggerPrefix}</a>;</li>`,
  })
  readonly data?: any;
}
