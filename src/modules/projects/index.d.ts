import { ProjectEntity } from './entities/project.entity';
export interface IGetListRes {
  list: ProjectEntity[];
  total: number;
}
export interface IPostCreateProject {
  projectName: string;
  projectType: string;
  workIndexFile?: string;
  projectLanguage?: string;
  projectCode?: string;
}
