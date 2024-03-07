import { AppEntity } from '@/modules/app.entity';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('workSpace')
export class WorkSpaceEntity extends AppEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', comment: '文件(夹)名称' })
  fileName: string;

  @Column({
    type: 'boolean',
    comment: '是否为文件夹',
  })
  isFolder: boolean;

  @Column({
    type: 'longtext',
    comment: '远程文件地址',
    nullable: true,
  })
  fileUrl: string;

  @Column({
    type: 'varchar',
    comment: '文件内容',
    nullable: true,
  })
  content: string;

  @Column({
    type: 'varchar',
    comment: '父目录',
  })
  parentFolder: string;

  @Column({
    type: 'varchar',
    comment: '文件后缀',
    nullable: true,
  })
  ext: string;

  @Column({
    type: 'varchar',
    comment: 'md5',
    nullable: true,
  })
  md: string;

  @ManyToOne(() => UserEntity, (user) => user.workFiles)
  user: UserEntity;
}
