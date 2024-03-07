import { AppEntity } from '@/modules/app.entity';
import { UsersEntity } from '@/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('projects')
export class ProjectsEntity extends AppEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  projectName: string;

  @Column({ type: 'int', default: 0 })
  lastStatus: number; // 0:未知,-1:错误,1:成功

  @Column({ type: 'varchar' })
  projectType: string; // 项目类型

  @Column({ type: 'longtext', nullable: true })
  code: string; // 代码(仅简单模式)

  @Column({ type: 'varchar', nullable: true })
  codeLanguage: string; // 代码语言

  @Column({ type: 'boolean', default: false })
  disable: boolean;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createTime: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updateTime: Date;

  @ManyToOne(() => UsersEntity, (user) => user.projects)
  user: UsersEntity;
}
