import { AppEntity } from '@/modules/app.entity';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('avatars')
export class AvatarsEntity extends AppEntity {
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
    comment: '文件内容',
  })
  content: string;

  @Column({
    type: 'varchar',
    comment: '父目录',
  })
  parentFolder: string;

  @OneToOne(() => UserEntity, (user) => user.avatar)
  user: UserEntity;
}
