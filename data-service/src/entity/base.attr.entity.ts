import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class BaseAttr {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'varchar' })
  userId: string;

  @Column({ name: 'customer_id', type: 'varchar' })
  customerId: string;

  @Column({ name: 'status', type: 'varchar' })
  status: string;
}
