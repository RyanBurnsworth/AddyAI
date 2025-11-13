import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usage')
export class Usage {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: false })
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'input_tokens' })
  inputTokens: number;

  @Column({ name: 'output_tokens' })
  outputTokens: number;

  @Column('double precision', { name: 'cost' })
  cost: number;

  @Column('double precision', { name: 'final_cost' })
  finalCost: number;

  @Column({ name: 'created_at' })
  createdAt: Date;
}
