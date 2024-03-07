import { AppEntity } from '@/modules/app.entity';
import { AvatarsEntity } from '@/modules/file/entities/avatar.entity';
import { ProjectEntity } from '@/modules/projects/entities/project.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity extends AppEntity {
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

  @OneToMany(() => ProjectEntity, (project) => project.user)
  @JoinColumn()
  projects: ProjectEntity[];

  @OneToOne(() => AvatarsEntity, (avatar) => avatar.user)
  @JoinColumn()
  avatar: AvatarsEntity;
}
