import { AdMetrics } from 'src/entity/ad.metrics.entity';
import { BaseMetricsDTO } from './base.metrics.dto';

export class AdMetricsDTO extends BaseMetricsDTO {
  static toEntity(userId: number, customerId: string, input: any): AdMetrics {
    const metrics = input.metrics || {};
    const campaign = input.campaign || {};
    const adGroup = input.ad_group || {};
    const segments = input.segments || {};
    const adGroupAd = input.ad_group_ad || {};
    const ad = adGroupAd.ad || {};

    const entity = new AdMetrics();

    entity.userId = userId;
    entity.customerId = customerId;
    entity.date = segments.date;
    entity.campaignId = campaign.id;
    entity.adGroupId = adGroup.id;
    entity.adId = ad.id;

    if (!campaign.id || !adGroup.id || !ad.id) return;

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
    entity.revenueMicros = Number(((metrics?.revenue_micros ?? 0) / 1_000_000).toFixed(2));
    entity.videoViews = metrics.video_views;
    entity.videoViewRate = metrics.video_view_rate;
    entity.videoQuartileP25Rate = metrics.video_quartile_25_rate;
    entity.videoQuartileP50Rate = metrics.video_quartile_50_rate;
    entity.videoQuartileP75Rate = metrics.video_quartile_75_rate;
    entity.videoQuartileP100Rate = metrics.video_quartile_100_rate;
    entity.valuePerAllConversions = metrics.value_per_all_conversions;
    entity.interactionRate = metrics.interaction_rate;
    entity.impressions = metrics.impressions;
    entity.interactions = metrics.interactions;
    entity.clicks = metrics.clicks;

    return entity;
  }
}
