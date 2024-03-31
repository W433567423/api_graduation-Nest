import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IResData } from '..';
import { DrwbncfService } from './drwbncf.service';

@ApiTags('DRWBNCF')
@Controller('drwbncf')
export class DrwbncfController {
  constructor(private readonly drwbncfService: DrwbncfService) {}
  @ApiOperation({ summary: '运行DRWBNC项目' })
  @Get('run')
  async run(): Promise<IResData<any>> {
    return await this.drwbncfService.run();
  }
}
