import { ProjectsEntity } from './entities/project.entity';
interface IGetListRes {
  list: ProjectsEntity[];
  total: number;
}

export type { IGetListRes };
