import { ApiProperty } from '@nestjs/swagger';
import { SERVER_PORT, swaggerPrefix } from '@/config';

export class CreateAppDto {
  @ApiProperty({ description: '状态码', example: '200' })
  code: number;
  @ApiProperty({
    description: '返回的信息',
    example: `<h1>hallo, this is tutu の graduation</h1><hr/><li>the swagger address is <a href="http://localhost:${SERVER_PORT}/${swaggerPrefix}">localhost:${SERVER_PORT}/${swaggerPrefix}</a>;</li>`,
  })
  message: string;
}
