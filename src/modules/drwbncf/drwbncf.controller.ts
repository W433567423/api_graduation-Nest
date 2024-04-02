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
  async run(): Promise<IResData<boolean>> {
    return await this.drwbncfService.runDrwbncf();
  }

  @ApiOperation({ summary: '获取DRWBNC项目的excel' })
  @Get('excel')
  async excel() {
    return { data: await this.drwbncfService.parseExcel() };
  }

  @ApiOperation({ summary: 'test' })
  @Get('test')
  async test() {
    return { data: await this.drwbncfService.parseExcel() };
  }
}
