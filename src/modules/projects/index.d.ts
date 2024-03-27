import { ProjectEntity } from './entities/project.entity';
export interface IGetListRes {
  list: ProjectEntity[];
  total: number;
}
export interface IPostCreateProject {
  projectName: string;
  projectType: string;
  indexFile?: string;
  projectLanguage?: string;
  projectCode?: string;
}
