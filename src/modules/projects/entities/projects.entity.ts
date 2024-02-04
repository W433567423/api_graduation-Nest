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

  @CreateDateColumn()
  createTime: Date;

  @CreateDateColumn()
  updateTime: Date;

  @ManyToOne(() => UsersEntity, (user) => user.projects)
  user: UsersEntity;
}
