import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('User')
export class User {
  @PrimaryColumn({ name: 'id' })
  id: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'picture' })
  picture: string;

  @Column({ name: 'refresh_token' })
  refreshToken: string;

  @Column({ name: 'access_token' })
  accessToken: string;

  @Column({ name: 'expires_in', nullable: true })
  expiresIn: number;

  @Column({ name: 'refresh_token_expires_in', nullable: true })
  refreshTokenExpiresIn: number;

  @Column({ name: 'token_type', nullable: true })
  tokenType: string;

  @Column({ name: 'scope', nullable: true })
  scope: string;

  @Column({ name: 'id_token', nullable: true })
  idToken: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'balance' })
  balance: number;

  @Column({ name: 'last_updated' })
  lastUpdated: Date;

  @Column({ name: 'created_at' })
  createdAt: Date;
}
