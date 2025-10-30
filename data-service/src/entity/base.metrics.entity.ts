import { PrimaryGeneratedColumn, Column } from 'typeorm';

export abstract class BaseMetricsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'date', type: 'date' })
  date: Date;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ name: 'customer_id', type: 'varchar' })
  customerId: string;

  @Column({ name: 'campaign_id', type: 'varchar' })
  campaignId: string;

  @Column({ name: 'clicks', type: 'int', nullable: true })
  clicks: number;

  @Column({ name: 'impressions', type: 'int', nullable: true })
  impressions: number;

  @Column({ name: 'ctr', type: 'double precision', nullable: true })
  ctr: number;

  @Column({ name: 'interactions', type: 'int', nullable: true })
  interactions: number;

  @Column({
    name: 'interaction_rate',
    type: 'double precision',
    nullable: true,
  })
  interactionRate: number;

  @Column({ name: 'average_cpc', type: 'double precision', nullable: true })
  averageCpc: number;

  @Column({ name: 'average_cpa', type: 'double precision', nullable: true })
  averageCpe: number;

  @Column({ name: 'average_cpm', type: 'double precision', nullable: true })
  averageCpm: number;

  @Column({ name: 'average_cpv', type: 'double precision', nullable: true })
  averageCpv: number;

  @Column({ name: 'average_cost', type: 'double precision', nullable: true })
  averageCost: number;

  @Column({ name: 'all_conversions', type: 'double precision', nullable: true })
  allConversions: number;

  @Column({
    name: 'all_conversions_value',
    type: 'double precision',
    nullable: true,
  })
  allConversionsValue: number;

  @Column({
    name: 'cost_per_all_conversions',
    type: 'double precision',
    nullable: true,
  })
  costPerAllConversions: number;

  @Column({
    name: 'value_per_all_conversions',
    type: 'double precision',
    nullable: true,
  })
  valuePerAllConversions: number;

  @Column({ name: 'cost', type: 'double precision', nullable: true })
  costMicros: number;

  @Column({ name: 'revenue', type: 'double precision', nullable: true })
  revenueMicros: number;

  @Column({ name: 'view_through_conversions', type: 'int', nullable: true })
  viewThroughConversions: number;

  @Column({
    name: 'video_quartile_100_rate',
    type: 'double precision',
    nullable: true,
  })
  videoQuartileP100Rate: number;

  @Column({
    name: 'video_quartile_25_rate',
    type: 'double precision',
    nullable: true,
  })
  videoQuartileP25Rate: number;

  @Column({
    name: 'video_quartile_50_rate',
    type: 'double precision',
    nullable: true,
  })
  videoQuartileP50Rate: number;

  @Column({
    name: 'video_quartile_75_rate',
    type: 'double precision',
    nullable: true,
  })
  videoQuartileP75Rate: number;

  @Column({ name: 'video_view_rate', type: 'double precision', nullable: true })
  videoViewRate: number;

  @Column({ name: 'video_views', type: 'int', nullable: true })
  videoViews: number;
}
