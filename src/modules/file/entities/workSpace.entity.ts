import { AppEntity } from '@/modules/app.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('workSpace')
export class WorkFileEntity extends AppEntity {
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
    type: 'int',
    comment: '父目录',
  })
  parentFolder: number;

  @Column({
    type: 'varchar',
    comment: '文件类型',
    nullable: true,
  })
  mimetype: string;

  @Column({
    type: 'varchar',
    comment: 'md5',
    nullable: true,
  })
  md: string;
}
