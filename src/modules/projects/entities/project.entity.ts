import { AppEntity } from '@/modules/app.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('projects')
export class ProjectEntity extends AppEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ comment: '用户id', type: 'int' })
  userId: number;

  @Column({ comment: '项目名称', type: 'varchar' })
  projectName: string;

  @Column({ comment: '上一次运行成功与否', type: 'int', default: 0 })
  lastStatus: number; // 0:未知,-1:错误,1:成功

  @Column({
    comment: '项目类型',
    type: 'varchar',
    // enum: ['simple', 'complex'],
    default: 'simple',
  })
  projectType: string;

  @Column({
    comment: '项目根目录id(复杂模式)',
    type: 'varchar',
    nullable: true,
  })
  rootWorkFoldId: number;

  @Column({ comment: '项目根目录(复杂模式)', type: 'varchar', nullable: true })
  rootWorkName: string;

  @Column({ comment: '项目入口(复杂模式)', type: 'varchar', nullable: true })
  workIndexFile: string;

  @Column({ comment: '代码(简单模式)', type: 'longtext', nullable: true })
  code: string;

  @Column({ comment: '代码语言(简单模式)', type: 'varchar', nullable: true })
  codeLanguage: string;

  @Column({ comment: '是否禁用项目', type: 'boolean', default: false })
  disable: boolean;

  // @ManyToOne(() => UserEntity, (user) => user.projects)
  // @JoinColumn()
  // user: UserEntity;
}
