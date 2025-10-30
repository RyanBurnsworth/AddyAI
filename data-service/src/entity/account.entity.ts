import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('account')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column({ name: 'manager_id', nullable: true })
  managerId: string;

  @Column({ name: 'is_manager' })
  isManager: boolean;

  @Column({ name: 'last_synced', nullable: true })
  lastSynced: Date;

  @Column({ name: 'created_at' })
  created_at: Date;
}
