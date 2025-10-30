import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transaction')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ name: 'session_id', type: 'varchar' })
  sessionId: string;

  @Column({ name: 'amount', type: 'int' })
  amount: number;

  @Column({ name: 'status', type: 'varchar' })
  status: string;

  @Column({ name: 'created_at' })
  createdAt: Date;
}
