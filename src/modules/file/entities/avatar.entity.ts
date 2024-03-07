import { UsersEntity } from '@/modules/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('avatars')
export class AvatarsEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  fileUrl: string;

  @OneToOne(() => UsersEntity, (user) => user.avatar)
  user: UsersEntity;
}
