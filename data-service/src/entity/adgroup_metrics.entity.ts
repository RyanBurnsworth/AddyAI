import { Entity, Column } from 'typeorm';
import { BaseMetricsEntity } from './base.metrics.entity';

@Entity('adgroup_metrics')
export class AdGroupMetrics extends BaseMetricsEntity {
  @Column({ name: 'adgroup_id', type: 'varchar' })
  adGroupId: string;

  @Column({ name: 'phone_calls', type: 'int', nullable: true })
  phoneCalls: number;

  @Column({ name: 'phone_impressions', type: 'int', nullable: true })
  phoneImpressions: number;

  @Column({ name: 'phone_through_rate', type: 'float', nullable: true })
  phoneThroughRate: number;

  @Column({
    name: 'search_absolute_top_impression_share',
    type: 'float',
    nullable: true,
  })
  searchAbsoluteTopImpressionShare: number;

  @Column({
    name: 'search_budget_lost_absolute_top_impression_share',
    type: 'float',
    nullable: true,
  })
  searchBudgetLostAbsoluteTopImpressionShare: number;

  @Column({
    name: 'search_budget_lost_top_impression_share',
    type: 'float',
    nullable: true,
  })
  searchBudgetLostTopImpressionShare: number;

  @Column({
    name: 'search_exact_match_impression_share',
    type: 'float',
    nullable: true,
  })
  searchExactMatchImpressionShare: number;

  @Column({ name: 'search_impression_share', type: 'float', nullable: true })
  searchImpressionShare: number;

  @Column({
    name: 'search_rank_lost_absolute_top_impression_share',
    type: 'float',
    nullable: true,
  })
  searchRankLostAbsoluteTopImpressionShare: number;

  @Column({
    name: 'search_rank_lost_impression_share',
    type: 'float',
    nullable: true,
  })
  searchRankLostImpressionShare: number;

  @Column({
    name: 'search_rank_lost_top_impression_share',
    type: 'float',
    nullable: true,
  })
  searchRankLostTopImpressionShare: number;

  @Column({
    name: 'search_top_impression_share',
    type: 'float',
    nullable: true,
  })
  searchTopImpressionShare: number;
}
