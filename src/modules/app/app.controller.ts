import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { SERVER_PORT } from '@/config';
import { swaggerPrefix } from '@/config/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @ApiTags('入口')
  @Get()
  hallo() {
    return `
        <h1>hallo, this is tutu の graduation</h1>
        <hr/>
        <li>the swagger address is <a href="http://localhost:${SERVER_PORT}/${swaggerPrefix}">localhost:${SERVER_PORT}/${swaggerPrefix}</a>;</li>
`;
  }
}
