import { IsDateString, IsString, IsOptional, IsNumber } from 'class-validator';

export class BaseMetricsDTO {
  @IsDateString()
  date: string;

  @IsString()
  campaignId: string;

  @IsOptional()
  @IsNumber()
  clicks?: number;

  @IsOptional()
  @IsNumber()
  impressions?: number;

  @IsOptional()
  @IsNumber()
  ctr?: number;

  @IsOptional()
  @IsNumber()
  interactions?: number;

  @IsOptional()
  @IsNumber()
  interaction_rate?: number;

  @IsOptional()
  @IsNumber()
  average_cpc?: number;

  @IsOptional()
  @IsNumber()
  average_cpe?: number;

  @IsOptional()
  @IsNumber()
  average_cpm?: number;

  @IsOptional()
  @IsNumber()
  average_cpv?: number;

  @IsOptional()
  @IsNumber()
  average_cost?: number;

  @IsOptional()
  @IsNumber()
  all_conversions?: number;

  @IsOptional()
  @IsNumber()
  all_conversions_value?: number;

  @IsOptional()
  @IsNumber()
  cost_per_all_conversions?: number;

  @IsOptional()
  @IsNumber()
  value_per_all_conversions?: number;

  @IsOptional()
  @IsNumber()
  cost_micros?: number;

  @IsOptional()
  @IsNumber()
  revenue_micros?: number;

  @IsOptional()
  @IsNumber()
  view_through_conversions?: number;

  @IsOptional()
  @IsNumber()
  video_quartile_p100_rate?: number;

  @IsOptional()
  @IsNumber()
  video_quartile_p75_rate?: number;

  @IsOptional()
  @IsNumber()
  video_quartile_p50_rate?: number;

  @IsOptional()
  @IsNumber()
  video_quartile_p25_rate?: number;

  @IsOptional()
  @IsNumber()
  video_view_rate?: number;

  @IsOptional()
  @IsNumber()
  video_views?: number;
}
