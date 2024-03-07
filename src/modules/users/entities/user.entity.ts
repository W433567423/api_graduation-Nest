import { AvatarsEntity } from '@/modules/file/entities/avatar.entity';
import { ProjectsEntity } from '@/modules/projects/entities/project.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class UsersEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  phone?: string;

  @Column({ type: 'varchar' })
  email: string;

  @OneToMany(() => ProjectsEntity, (project) => project.user)
  projects: ProjectsEntity[];

  @OneToOne(() => AvatarsEntity, (avatar) => avatar.user)
  avatar: AvatarsEntity;
}
