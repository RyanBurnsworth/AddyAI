import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseMetricsEntity } from './base.metrics.entity';

@Entity('campaign_metrics')
export class CampaignMetrics extends BaseMetricsEntity {
  @Column({ name: 'phone_calls', type: 'int', nullable: true })
  phoneCalls: number;

  @Column({ name: 'phone_impressions', type: 'int', nullable: true })
  phoneImpressions: number;

  @Column({
    name: 'phone_through_rate',
    type: 'double precision',
    nullable: true,
  })
  phoneThroughRate: number;

  @Column({
    name: 'invalid_click_rate',
    type: 'double precision',
    nullable: true,
  })
  invalidClickRate: number;

  @Column({ name: 'invalid_clicks', type: 'int', nullable: true })
  invalidClicks: number;

  @Column({
    name: 'search_absolute_top_impression_share',
    type: 'double precision',
    nullable: true,
  })
  searchAbsoluteTopImpressionShare: number;

  @Column({
    name: 'search_budget_lost_absolute_top_impression_share',
    type: 'double precision',
    nullable: true,
  })
  searchBudgetLostAbsoluteTopImpressionShare: number;

  @Column({
    name: 'search_budget_lost_impression_share',
    type: 'double precision',
    nullable: true,
  })
  searchBudgetLostImpressionShare: number;

  @Column({
    name: 'search_budget_lost_top_impression_share',
    type: 'double precision',
    nullable: true,
  })
  searchBudgetLostTopImpressionShare: number;

  @Column({
    name: 'search_click_share',
    type: 'double precision',
    nullable: true,
  })
  searchClickShare: number;

  @Column({
    name: 'search_rank_exact_match_impression_share',
    type: 'double precision',
    nullable: true,
  })
  searchExactMatchImpressionShare: number;

  @Column({
    name: 'search_impression_share',
    type: 'double precision',
    nullable: true,
  })
  searchImpressionShare: number;

  @Column({
    name: 'search_rank_lost_absolute_top_impression_share',
    type: 'double precision',
    nullable: true,
  })
  searchRankLostAbsoluteTopImpressionShare: number;

  @Column({
    name: 'search_rank_lost_impression_share',
    type: 'double precision',
    nullable: true,
  })
  searchRankLostImpressionShare: number;

  @Column({
    name: 'search_rank_lost_top_impression_share',
    type: 'double precision',
    nullable: true,
  })
  searchRankLostTopImpressionShare: number;

  @Column({
    name: 'search_top_impression_share',
    type: 'double precision',
    nullable: true,
  })
  searchTopImpressionShare: number;
}
