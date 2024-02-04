import { ProjectsEntity } from './entities/projects.entity';
interface IGetListRes {
  list: ProjectsEntity[];
  total: number;
}

export type { IGetListRes };
