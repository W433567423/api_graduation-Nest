import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersController } from '@/modules/users/users.controller';
import { UsersService } from '@/modules/users/users.service';
import { UsersModule } from '@/modules/users/users.module';
import { MySQLConfig } from '@/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(MySQLConfig), UsersModule],
  controllers: [AppController, UsersController],
  providers: [UsersService],
})
export class AppModule {}
