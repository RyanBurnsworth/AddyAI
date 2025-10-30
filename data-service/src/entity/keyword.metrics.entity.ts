import { Entity, Column } from 'typeorm';
import { BaseMetricsEntity } from './base.metrics.entity';

@Entity('keyword_metrics')
export class KeywordMetrics extends BaseMetricsEntity {
  @Column({ name: 'adgroup_id', type: 'varchar' })
  adGroupId: string;

  @Column({ name: 'criterion_id', type: 'varchar' })
  criterionId: string;

  @Column({
    name: 'search_absolute_top_impression_share',
    type: 'float',
    nullable: true,
  })
  searchAbsoluteTopImpressionShare?: number;

  @Column({
    name: 'search_budget_lost_absolute_top_impression_share',
    type: 'float',
    nullable: true,
  })
  searchBudgetLostAbsoluteTopImpressionShare?: number;

  @Column({
    name: 'search_budget_lost_top_impression_share',
    type: 'float',
    nullable: true,
  })
  searchBudgetLostTopImpressionShare?: number;

  @Column({ name: 'search_click_share', type: 'float', nullable: true })
  searchClickShare?: number;

  @Column({
    name: 'search_exact_match_impression_share',
    type: 'float',
    nullable: true,
  })
  searchExactMatchImpressionShare?: number;

  @Column({ name: 'search_impression_share', type: 'float', nullable: true })
  searchImpressionShare?: number;

  @Column({
    name: 'search_rank_lost_absolute_top_impression_share',
    type: 'float',
    nullable: true,
  })
  searchRankLostAbsoluteTopImpressionShare?: number;

  @Column({
    name: 'search_rank_lost_impression_share',
    type: 'float',
    nullable: true,
  })
  searchRankLostImpressionShare?: number;

  @Column({
    name: 'search_rank_lost_top_impression_share',
    type: 'float',
    nullable: true,
  })
  searchRankLostTopImpressionShare?: number;

  @Column({
    name: 'search_top_impression_share',
    type: 'float',
    nullable: true,
  })
  searchTopImpressionShare?: number;
}
