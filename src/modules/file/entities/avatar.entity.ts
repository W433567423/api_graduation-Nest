import { AppEntity } from '@/modules/app.entity';
import { UsersEntity } from '@/modules/users/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('avatars')
export class AvatarsEntity extends AppEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  fileUrl: string;

  @Column({
    type: 'varchar',
    name: 'mimetype',
  })
  mimetype: string;

  @Column({
    type: 'varchar',
    name: 'size',
  })
  size: string;

  @OneToOne(() => UsersEntity, (user) => user.avatar)
  user: UsersEntity;
}
