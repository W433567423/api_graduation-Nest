import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from '../file/file.module';
import { SocketsModule } from '../sockets/sockets.module';
import { ProjectEntity } from './entities/project.entity';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [
    FileModule,
    SocketsModule,
    TypeOrmModule.forFeature([ProjectEntity]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [],
})
export class ProjectModule {}
