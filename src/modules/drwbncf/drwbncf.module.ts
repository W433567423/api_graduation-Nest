import { Module } from '@nestjs/common';
import { DrwbncfController } from './drwbncf.controller';
import { DrwbncfService } from './drwbncf.service';

@Module({
  controllers: [DrwbncfController],
  providers: [DrwbncfService],
})
export class DrwbncfModule {}
