import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../users/user.module';
import { ProjectsEntity } from './entities/project.entity';
import { ProjectsController } from './project.controller';
import { ProjectsService } from './project.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectsEntity]), UserModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [TypeOrmModule],
})
export class ProjectsModule {}
