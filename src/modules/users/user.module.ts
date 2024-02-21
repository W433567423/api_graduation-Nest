import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '@/modules/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '@/config/jwt.config';
@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    JwtModule.register(jwtConfig),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule, UsersModule],
})
export class UsersModule {}
