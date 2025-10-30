import { IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { enums } from 'google-ads-api';
import { KeywordAttr } from '../entity/keyword.attr.entity';

export class Keyword {
  @IsNumber()
  text: string;

  @IsNumber()
  match_type: number;
}

export class KeywordAttrDTO {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  ad_group: string;

  @IsNumber()
  type: number;

  @IsNumber()
  status: number;

  @IsNumber()
  bid_modifier?: number;

  @IsNumber()
  cpc_bid_micros?: number;

  @IsObject()
  @ValidateNested()
  keyword: Keyword;

  static toEntity(userId: number, customerId: string, row: any) {
    const keywordAttrDto = row.ad_group_criterion;
    const campaign = row.campaign;
    const adgroup = row.ad_group;

    const keywordAttr = new KeywordAttr();
    keywordAttr.userId = userId;
    keywordAttr.customerId = customerId;
    keywordAttr.campaignId = campaign.id;
    keywordAttr.adgroupId = adgroup.id;

    keywordAttr.bidModifier = keywordAttrDto.bid_modifier;
    keywordAttr.cpcBid = Number(((keywordAttrDto?.cpc_bid_micros ?? 0) / 1_000_000).toFixed(2));
    keywordAttr.keywordId = keywordAttrDto.criterion_id;
    keywordAttr.keywordText = keywordAttrDto.keyword?.text;
    keywordAttr.matchType = enums.KeywordMatchType[keywordAttrDto.keyword?.match_type];
    keywordAttr.status = enums.AdGroupCriterionStatus[keywordAttrDto.status];
    keywordAttr.type = enums.CriterionType[keywordAttrDto.type];

    return keywordAttr;
  }
}
