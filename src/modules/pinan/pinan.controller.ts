import { NoAuth } from '@/global/decorator';
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PinanService } from './pinan.service';

@NoAuth()
@ApiTags('充值平台')
@Controller('pinan')
export class PinanController {
  constructor(private readonly pinanService: PinanService) {}

  @ApiOperation({ summary: '获取产码信息' })
  @Get('producedYard')
  getProductMessage() {
    const res = this.pinanService.getProductMessage();
    console.log(
      '🚀 ~ PinanController ~ getProductMessage ~ res:',
      JSON.stringify(res),
    );
    return res;
  }
}
