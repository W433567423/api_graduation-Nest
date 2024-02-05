import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './project.service';
import { ProjectsController } from './project.controller';
import { ProjectsEntity } from './entities/project.entity';
import { UsersModule } from '../users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectsEntity]), UsersModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [TypeOrmModule],
})
export class ProjectsModule {}
