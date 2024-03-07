import { BaseEntity, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class AppEntity extends BaseEntity {
  @UpdateDateColumn({
    name: 'createAt',
    type: 'timestamp',
  })
  createAt!: Date;

  @UpdateDateColumn({
    name: 'updateAt',
    type: 'timestamp',
  })
  updateAte!: Date;
}
