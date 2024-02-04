import { UsersEntity } from '@/modules/users/entities/users.entity';
import {
  BaseEntity,
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('projcts')
export class ProjectsEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  projectName: string;

  @Column({ type: 'int', default: 0 })
  lastStatus: number; // 0:未知,-1:错误,1:成功

  @CreateDateColumn()
  createTime: Date;

  @CreateDateColumn()
  updateTime: Date;

  @ManyToOne(() => UsersEntity, (user) => user.projects)
  user: UsersEntity;
}
