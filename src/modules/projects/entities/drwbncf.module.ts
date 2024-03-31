import { Module } from '@nestjs/common';
import { DrwbncfController } from '../../drwbncf/drwbncf.controller';
import { DrwbncfService } from '../../drwbncf/drwbncf.service';
import { SocketsModule } from '../../sockets/sockets.module';

@Module({
  imports: [SocketsModule],
  controllers: [DrwbncfController],
  providers: [DrwbncfService],
})
export class DrwbncfModule {}
