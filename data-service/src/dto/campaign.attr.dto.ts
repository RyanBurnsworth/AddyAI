import { IsBoolean, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { enums } from 'google-ads-api';
import { CampaignAttr } from '../entity/campaign.attr.entity';

class ManualCPC {
  @IsBoolean()
  enhanced_cpc_enabled: boolean;
}

class MaximizeConversionValue {
  @IsNumber()
  target_roas: number;
}

class MaximizeConversions {
  @IsNumber()
  target_cpa_micros: number;
}

class NetworkSettings {
  @IsBoolean()
  target_content_network: boolean;

  @IsBoolean()
  target_google_search: boolean;

  @IsBoolean()
  target_partner_search_network: boolean;

  @IsBoolean()
  target_search_network: boolean;

  @IsBoolean()
  target_youtube: boolean;
}

class PercentCPC {
  @IsNumber()
  cpc_bid_ceiling_micros: number;

  @IsBoolean()
  enhanced_cpc_enabled: boolean;
}

export class CampaignAttrDTO {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  campaign_budget: string;

  @IsNotEmpty()
  advertising_channel_type: string;

  @IsNumber()
  @IsNotEmpty()
  status: number;

  @IsOptional()
  @IsObject()
  manual_cpc: ManualCPC;

  @IsOptional()
  @IsObject()
  maximize_conversion_value: MaximizeConversionValue;

  @IsOptional()
  @IsObject()
  maximize_conversions: MaximizeConversions;

  @IsOptional()
  @IsObject()
  network_settings: NetworkSettings;

  @IsOptional()
  @IsObject()
  percent_cpc: PercentCPC;

  @IsOptional()
  @IsNumber()
  optimization_score: number;

  @IsString()
  start_date: string;

  @IsString()
  end_date: string;

  static toEntity(userId: number, customerId: string, row: any): CampaignAttr {
    const campaignAttrDTO: CampaignAttrDTO = row.campaign;

    const campaignEntity = new CampaignAttr();
    campaignEntity.userId = userId;
    campaignEntity.customerId = customerId;
    campaignEntity.campaignId = campaignAttrDTO.id;
    campaignEntity.name = campaignAttrDTO.name;
    campaignEntity.budgetResourceName = campaignAttrDTO.campaign_budget;
    campaignEntity.type = enums.AdvertisingChannelType[campaignAttrDTO.advertising_channel_type];
    campaignEntity.status = enums.CampaignStatus[campaignAttrDTO.status];
    campaignEntity.enhancedCPCEnabled = campaignAttrDTO.manual_cpc?.enhanced_cpc_enabled ?? false;
    campaignEntity.targetRoas = campaignAttrDTO.maximize_conversion_value?.target_roas ?? 0.0;
    campaignEntity.targetCPA = Number(
      ((campaignAttrDTO?.maximize_conversions?.target_cpa_micros ?? 0) / 1_000_000).toFixed(2)
    );
    campaignEntity.targetContentNetwork =
      campaignAttrDTO.network_settings?.target_content_network ?? false;
    campaignEntity.targetGoogleSearch =
      campaignAttrDTO.network_settings?.target_google_search ?? false;
    campaignEntity.targetPartnerSearchNetwork =
      campaignAttrDTO.network_settings?.target_partner_search_network ?? false;
    campaignEntity.targetSearchNetwork =
      campaignAttrDTO.network_settings?.target_search_network ?? false;
    campaignEntity.targetYoutube = campaignAttrDTO.network_settings?.target_youtube ?? false;
    campaignEntity.cpcBidCeiling = Number(
      ((campaignAttrDTO?.percent_cpc?.cpc_bid_ceiling_micros ?? 0) / 1_000_000).toFixed(2)
    );
    campaignEntity.optimizationScore = campaignAttrDTO?.optimization_score ?? 0.0;
    campaignEntity.startDate = new Date(campaignAttrDTO?.start_date ?? new Date());
    campaignEntity.endDate = new Date(campaignAttrDTO?.end_date ?? new Date());
    return campaignEntity;
  }
}
