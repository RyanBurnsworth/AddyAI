import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class BaseAttr {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ name: 'customer_id', type: 'varchar' })
  customerId: string;

  @Column({ name: 'status', type: 'varchar' })
  status: string;
}
