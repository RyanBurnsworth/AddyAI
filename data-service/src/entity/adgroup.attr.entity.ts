import { Column, Entity } from 'typeorm';
import { BaseAttr } from './base.attr.entity';

@Entity('adgroup_attr')
export class AdGroupAttr extends BaseAttr {
  @Column({ name: 'campaign_id', type: 'varchar' })
  campaignId: string;

  @Column({ name: 'adgroup_id', type: 'varchar' })
  adgroupId: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'type', nullable: true })
  type: string;

  @Column({ name: 'cpc_bid', type: 'double precision', nullable: true })
  cpcBid: number;

  @Column({ name: 'cpm_bid', type: 'double precision', nullable: true })
  cpmBid: number;

  @Column({ name: 'cpv_bid', type: 'double precision', nullable: true })
  cpvBid: number;

  @Column({ name: 'target_cpc', type: 'double precision', nullable: true })
  targetCpc: number;

  @Column({ name: 'target_cpm', type: 'double precision', nullable: true })
  targetCpm: number;

  @Column({ name: 'target_cpv', type: 'double precision', nullable: true })
  targetCpv: number;
}
