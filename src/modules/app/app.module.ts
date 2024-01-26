import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  // TypeOrmModule.forRoot(MySQLConfig)
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
