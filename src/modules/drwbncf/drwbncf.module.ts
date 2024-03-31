import { Module } from '@nestjs/common';
import { SocketsModule } from '../sockets/sockets.module';
import { DrwbncfController } from './drwbncf.controller';
import { DrwbncfService } from './drwbncf.service';

@Module({
  imports: [SocketsModule],
  controllers: [DrwbncfController],
  providers: [DrwbncfService],
})
export class DrwbncfModule {}
