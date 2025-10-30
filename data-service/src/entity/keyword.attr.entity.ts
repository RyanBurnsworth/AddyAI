import { Column, Entity } from 'typeorm';
import { BaseAttr } from './base.attr.entity';

@Entity('keyword_attr')
export class KeywordAttr extends BaseAttr {
  @Column({ name: 'campaign_id', type: 'varchar' })
  campaignId: string;

  @Column({ name: 'adgroup_id', type: 'varchar' })
  adgroupId: string;

  @Column({ name: 'keyword_id', type: 'varchar' })
  keywordId: string;

  @Column({ name: 'type' })
  type: string;

  @Column({ name: 'bid_modifier', type: 'double precision', nullable: true })
  bidModifier: number;

  @Column({ name: 'cpc_bid', type: 'double precision', nullable: true })
  cpcBid: number;

  @Column({ name: 'keyword_text', nullable: true })
  keywordText: string;

  @Column({ name: 'match_type', nullable: true })
  matchType: string;
}
