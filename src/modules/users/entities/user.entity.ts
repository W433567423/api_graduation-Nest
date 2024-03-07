import { AppEntity } from '@/modules/app.entity';
import { AvatarsEntity } from '@/modules/file/entities/avatar.entity';
import { WorkSpaceEntity } from '@/modules/file/entities/workSpace.entity';
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

  @Column({ type: 'varchar', comment: '用户名' })
  username: string;

  @Column({ type: 'varchar', comment: '密码(加密后)' })
  password: string;

  @Column({ type: 'varchar', nullable: true, comment: '联系电话' })
  phone?: string;

  @Column({ type: 'varchar', comment: '电子邮件' })
  email: string;

  @OneToMany(() => ProjectEntity, (project) => project.user)
  @JoinColumn()
  projects: ProjectEntity[];

  @OneToMany(() => WorkSpaceEntity, (workFile) => workFile.user)
  @JoinColumn()
  workFiles: WorkSpaceEntity[];

  @OneToOne(() => AvatarsEntity, (avatar) => avatar.user)
  @JoinColumn()
  avatar: AvatarsEntity;
}
