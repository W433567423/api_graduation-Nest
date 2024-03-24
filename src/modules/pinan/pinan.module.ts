import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { UserModule } from '../users/user.module';
import { PinanController } from './pinan.controller';
import { PinanService } from './pinan.service';

@Module({
  imports: [HttpModule, UserModule],
  controllers: [PinanController],
  providers: [PinanService],
})
export class PinanModule {}
