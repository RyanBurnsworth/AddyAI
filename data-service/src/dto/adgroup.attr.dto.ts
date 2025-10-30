import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { enums } from 'google-ads-api';
import { AdGroupAttr } from '../entity/adgroup.attr.entity';

export class AdGroupAttrDTO {
  @IsNumber()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  type: number;

  @IsNumber()
  @IsNotEmpty()
  status: number;

  @IsNumber()
  cpc_bid_micros: number;

  @IsNumber()
  cpm_bid_micros: number;

  @IsNumber()
  cpv_bid_micros: number;

  @IsNumber()
  target_cpc_micros: number;

  @IsNumber()
  target_cpm_micros: number;

  @IsNumber()
  target_cpv_micros: number;

  static toEntity(userId: number, customerId: string, row: any): AdGroupAttr {
    const adGroupDTO: AdGroupAttrDTO = row.ad_group;
    const campaign = row.campaign || {};

    const adGroupAttr = new AdGroupAttr();
    adGroupAttr.userId = userId;
    adGroupAttr.customerId = customerId;
    adGroupAttr.campaignId = campaign.id;
    adGroupAttr.adgroupId = adGroupDTO.id;
    adGroupAttr.name = adGroupDTO.name;
    adGroupAttr.type = enums.AdGroupType[adGroupDTO.type];
    adGroupAttr.status = enums.AdGroupStatus[adGroupDTO.status];
    adGroupAttr.cpcBid = Number(((adGroupDTO?.cpc_bid_micros ?? 0) / 1_000_000).toFixed(2));
    adGroupAttr.cpmBid = Number(((adGroupDTO?.cpm_bid_micros ?? 0) / 1_000_000).toFixed(2));
    adGroupAttr.cpvBid = Number(((adGroupDTO?.cpv_bid_micros ?? 0) / 1_000_000).toFixed(2));
    adGroupAttr.targetCpc = Number(((adGroupDTO?.target_cpc_micros ?? 0) / 1_000_000).toFixed(2));
    adGroupAttr.targetCpm = Number(((adGroupDTO?.target_cpm_micros ?? 0) / 1_000_000).toFixed(2));
    adGroupAttr.targetCpv = Number(((adGroupDTO?.target_cpv_micros ?? 0) / 1_000_000).toFixed(2));

    return adGroupAttr;
  }
}
