import { IsNumber, IsOptional, IsString } from 'class-validator';
import { KeywordMetrics } from '../entity/keyword.metrics.entity';
import { BaseMetricsDTO } from './base.metrics.dto';

export class KeywordMetricsDTO extends BaseMetricsDTO {
  @IsString()
  adGroupId: string;

  @IsString()
  criterionId: string;

  @IsOptional()
  @IsNumber()
  searchAbsoluteTopImpressionShare?: number;

  @IsOptional()
  @IsNumber()
  searchBudgetLostAbsoluteTopImpressionShare?: number;

  @IsOptional()
  @IsNumber()
  searchBudgetLostTopImpressionShare?: number;

  @IsOptional()
  @IsNumber()
  searchClickShare?: number;

  @IsOptional()
  @IsNumber()
  searchExactMatchImpressionShare?: number;

  @IsOptional()
  @IsNumber()
  searchImpressionShare?: number;

  @IsOptional()
  @IsNumber()
  searchRankLostAbsoluteTopImpressionShare?: number;

  @IsOptional()
  @IsNumber()
  searchRankLostImpressionShare?: number;

  @IsOptional()
  @IsNumber()
  searchRankLostTopImpressionShare?: number;

  @IsOptional()
  @IsNumber()
  searchTopImpressionShare?: number;

  static toEntity(userId: string, customerId: string, row: any): KeywordMetrics {
    const metrics = row.metrics || {};
    const campaign = row.campaign || {};
    const adGroup = row.ad_group || {};
    const adGroupCriterion = row.ad_group_criterion || {};
    const segments = row.segments || {};

    const entity = new KeywordMetrics();

    entity.userId = userId;
    entity.customerId = customerId;

    entity.date = segments.date;
    entity.campaignId = campaign.id;
    entity.adGroupId = adGroup.id;
    entity.criterionId = adGroupCriterion.criterion_id;

    entity.allConversions = metrics.all_conversions;
    entity.allConversionsValue = Number(
      ((metrics?.all_conversions_value ?? 0) / 1_000_000).toFixed(2)
    );
    entity.averageCost = Number(((metrics?.average_cost ?? 0) / 1_000_000).toFixed(2));
    entity.averageCpc = Number(((metrics?.average_cpc ?? 0) / 1_000_000).toFixed(2));
    entity.averageCpe = Number(((metrics?.average_cpe ?? 0) / 1_000_000).toFixed(2));
    entity.averageCpm = Number(((metrics?.average_cpm ?? 0) / 1_000_000).toFixed(2));
    entity.averageCpv = Number(((metrics?.average_cpv ?? 0) / 1_000_000).toFixed(2));
    entity.clicks = metrics.clicks;
    entity.costMicros = Number(((metrics?.cost_micros ?? 0) / 1_000_000).toFixed(2));
    entity.costPerAllConversions = Number(
      ((metrics?.cost_per_all_conversions ?? 0) / 1_000_000).toFixed(2)
    );
    entity.ctr = metrics.ctr;
    entity.interactionRate = metrics.interaction_rate;
    entity.interactions = metrics.interactions;
    entity.revenueMicros = Number(((metrics?.revenue_micros ?? 0) / 1_000_000).toFixed(2));
    entity.searchAbsoluteTopImpressionShare = metrics.search_absolute_top_impression_share;
    entity.searchBudgetLostAbsoluteTopImpressionShare =
      metrics.search_budget_lost_absolute_top_impression_share;
    entity.searchBudgetLostTopImpressionShare = metrics.search_budget_lost_top_impression_share;
    entity.searchClickShare = metrics.search_click_share;
    entity.searchExactMatchImpressionShare = metrics.search_exact_match_impression_share;
    entity.searchImpressionShare = metrics.search_impression_share;
    entity.searchRankLostAbsoluteTopImpressionShare =
      metrics.search_rank_lost_absolute_top_impression_share;
    entity.searchRankLostImpressionShare = metrics.search_rank_lost_impression_share;
    entity.searchRankLostTopImpressionShare = metrics.search_rank_lost_top_impression_share;
    entity.searchTopImpressionShare = metrics.search_top_impression_share;
    entity.valuePerAllConversions = metrics.value_per_all_conversions;
    entity.videoQuartileP100Rate = metrics.video_quartile_p100_rate;
    entity.videoQuartileP25Rate = metrics.video_quartile_p25_rate;
    entity.videoQuartileP50Rate = metrics.video_quartile_p50_rate;
    entity.videoQuartileP75Rate = metrics.video_quartile_p75_rate;
    entity.videoViewRate = metrics.video_view_rate;
    entity.videoViews = metrics.video_views;
    entity.viewThroughConversions = metrics.view_through_conversions;

    return entity;
  }
}
