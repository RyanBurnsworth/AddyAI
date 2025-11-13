import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export class Exchange {
  // request from the user
  input: string;

  // response from the LLM
  output: string;

  completedAt: Date;
}

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column({ type: 'jsonb', name: 'exchanges' })
  exchange: Exchange[];

  @Column({ name: 'created_at' })
  createdAt: Date;
}
