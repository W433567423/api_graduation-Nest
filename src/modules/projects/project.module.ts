import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from '../file/file.module';
import { UserModule } from '../users/user.module';
import { ProjectEntity } from './entities/project.entity';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity]), UserModule, FileModule],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [TypeOrmModule],
})
export class ProjectModule {}
