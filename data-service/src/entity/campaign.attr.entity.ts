import { Column, Entity } from 'typeorm';
import { BaseAttr } from './base.attr.entity';

@Entity('campaign_attr')
export class CampaignAttr extends BaseAttr {
  @Column({ name: 'campaign_id', type: 'varchar' })
  campaignId: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'budget_resource_name' })
  budgetResourceName: string;

  @Column({ name: 'type' })
  type: string;

  @Column({ name: 'enhanced_cpc_enabled' })
  enhancedCPCEnabled?: boolean;

  @Column({ name: 'target_roas', type: 'double precision' })
  targetRoas?: number;

  @Column({ name: 'target_cpa', type: 'double precision' })
  targetCPA?: number;

  @Column({ name: 'target_content_network' })
  targetContentNetwork?: boolean;

  @Column({ name: 'target_google_search' })
  targetGoogleSearch?: boolean;

  @Column({ name: 'target_partner_search_network' })
  targetPartnerSearchNetwork?: boolean;

  @Column({ name: 'target_search_network' })
  targetSearchNetwork?: boolean;

  @Column({ name: 'target_youtube' })
  targetYoutube?: boolean;

  @Column({ name: 'cpc_bid_ceiling', type: 'double precision' })
  cpcBidCeiling?: number;

  @Column({ name: 'optimization_score', type: 'double precision' })
  optimizationScore?: number;

  @Column({ name: 'start_date' })
  startDate?: Date;

  @Column({ name: 'end_date' })
  endDate?: Date;
}
