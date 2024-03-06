import { ProjectsEntity } from './entities/project.entity';
export interface IGetListRes {
  list: ProjectsEntity[];
  total: number;
}
export interface IPostCreateProject {
  projectName: string;
  projectType: string;
  projectLanguage?: string;
  projectCode?: string;
}
