import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UserModule } from '../users/user.module';
import { PeaceController } from './peace.controller';
import { PeaceService } from './peace.service';

@Module({
  imports: [HttpModule, UserModule],
  controllers: [PeaceController],
  providers: [PeaceService],
})
export class PeaceModule {}
