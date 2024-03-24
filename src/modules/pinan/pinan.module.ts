import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PinanController } from './pinan.controller';
import { PinanService } from './pinan.service';

@Module({
  imports: [
    HttpModule.register({
      headers: {
        Cookie: '.ASPXAUTHx=93333EA1DB6F8CDDE05978D938C0640F',
      },
    }),
  ],
  controllers: [PinanController],
  providers: [PinanService],
})
export class PinanModule {}
