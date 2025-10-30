import { IsNumber, IsOptional } from 'class-validator';
import { CampaignMetrics } from '../entity/campaign.metrics.entity';
import { BaseMetricsDTO } from './base.metrics.dto';

export class CampaignMetricsDTO extends BaseMetricsDTO {
  @IsOptional()
  @IsNumber()
  phone_calls?: number;

  @IsOptional()
  @IsNumber()
  phone_impressions?: number;

  @IsOptional()
  @IsNumber()
  phone_through_rate?: number;

  @IsOptional()
  @IsNumber()
  invalid_click_rate?: number;

  @IsOptional()
  @IsNumber()
  invalid_clicks?: number;

  @IsOptional()
  @IsNumber()
  search_absolute_top_impression_share?: number;

  @IsOptional()
  @IsNumber()
  search_budget_lost_absolute_top_impression_share?: number;

  @IsOptional()
  @IsNumber()
  search_budget_lost_impression_share?: number;

  @IsOptional()
  @IsNumber()
  search_budget_lost_top_impression_share?: number;

  @IsOptional()
  @IsNumber()
  search_click_share?: number;

  @IsOptional()
  @IsNumber()
  search_exact_match_impression_share?: number;

  @IsOptional()
  @IsNumber()
  search_impression_share?: number;

  @IsOptional()
  @IsNumber()
  search_rank_lost_absolute_top_impression_share?: number;

  @IsOptional()
  @IsNumber()
  search_rank_lost_impression_share?: number;

  @IsOptional()
  @IsNumber()
  search_rank_lost_top_impression_share?: number;

  @IsOptional()
  @IsNumber()
  search_top_impression_share?: number;

  static toEntity(userId: number, customerId: string, row: any): CampaignMetrics {
    const metrics = row.metrics || {};
    const campaign = row.campaign || {};
    const segments = row.segments || {};

    const entity = new CampaignMetrics();

    entity.userId = userId;
    entity.customerId = customerId;
    entity.campaignId = campaign.id;
    entity.date = segments.date;

    entity.averageCost = Number(((metrics?.average_cost ?? 0) / 1_000_000).toFixed(2));
    entity.averageCpc = Number(((metrics?.average_cpc ?? 0) / 1_000_000).toFixed(2));
    entity.averageCpe = Number(((metrics?.average_cpe ?? 0) / 1_000_000).toFixed(2));
    entity.averageCpm = Number(((metrics?.average_cpm ?? 0) / 1_000_000).toFixed(2));
    entity.averageCpv = Number(((metrics?.average_cpv ?? 0) / 1_000_000).toFixed(2));
    entity.allConversions = metrics.all_conversions;
    entity.allConversionsValue = Number(
      ((metrics?.all_conversions_value ?? 0) / 1_000_000).toFixed(2)
    );
    entity.costMicros = Number(((metrics?.cost_micros ?? 0) / 1_000_000).toFixed(2));
    entity.costPerAllConversions = Number(
      ((metrics?.cost_per_all_conversions ?? 0) / 1_000_000).toFixed(2)
    );
    entity.ctr = metrics.ctr;
    entity.phoneCalls = metrics.phone_calls;
    entity.phoneImpressions = metrics.phone_impressions;
    entity.phoneThroughRate = metrics.phone_through_rate;
    entity.revenueMicros = Number(((metrics?.revenue_micros ?? 0) / 1_000_000).toFixed(2));
    entity.videoViews = metrics.video_views;
    entity.videoViewRate = metrics.video_view_rate;
    entity.videoQuartileP25Rate = metrics.video_quartile_25_rate;
    entity.videoQuartileP50Rate = metrics.video_quartile_50_rate;
    entity.videoQuartileP75Rate = metrics.video_quartile_75_rate;
    entity.videoQuartileP100Rate = metrics.video_quartile_100_rate;
    entity.valuePerAllConversions = metrics.value_per_all_conversions;
    entity.invalidClickRate = metrics.invalid_click_rate;
    entity.invalidClicks = metrics.invalid_clicks;
    entity.interactionRate = metrics.interaction_rate;
    entity.impressions = metrics.impressions;
    entity.interactions = metrics.interactions;
    entity.clicks = metrics.clicks;

    entity.searchAbsoluteTopImpressionShare = metrics.search_absolute_top_impression_share;
    entity.searchBudgetLostAbsoluteTopImpressionShare =
      metrics.search_budget_lost_absolute_top_impression_share;
    entity.searchBudgetLostImpressionShare = metrics.search_budget_lost_impression_share;
    entity.searchBudgetLostTopImpressionShare = metrics.search_budget_lost_top_impression_share;
    entity.searchClickShare = metrics.search_click_share;
    entity.searchExactMatchImpressionShare = metrics.search_exact_match_impression_share;
    entity.searchImpressionShare = metrics.search_impression_share;
    entity.searchRankLostAbsoluteTopImpressionShare =
      metrics.search_rank_lost_absolute_top_impression_share;
    entity.searchRankLostImpressionShare = metrics.search_rank_lost_impression_share;
    entity.searchRankLostTopImpressionShare = metrics.search_rank_lost_top_impression_share;
    entity.searchTopImpressionShare = metrics.search_top_impression_share;
    entity.viewThroughConversions = metrics.view_through_conversions;

    return entity;
  }
}
