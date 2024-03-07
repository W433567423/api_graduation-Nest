import { jwtConfig } from '@/config/jwt.config';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register(jwtConfig),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
