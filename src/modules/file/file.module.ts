import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvatarsEntity } from './entities/avatar.entity';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [TypeOrmModule.forFeature([AvatarsEntity])],
  controllers: [FileController],
  providers: [FileService],
  exports: [TypeOrmModule],
})
export class FileModule {}
