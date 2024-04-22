import { Module } from '@nestjs/common';
import { HfsService } from './hfs.service';
import { HfsController } from './hfs.controller';

@Module({
  controllers: [HfsController],
  providers: [HfsService],
})
export class HfsModule {}
