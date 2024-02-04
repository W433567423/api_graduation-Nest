import { BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('projcts')
export class ProjectsEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;
}
