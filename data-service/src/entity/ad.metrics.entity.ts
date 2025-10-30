import { Entity, Column } from 'typeorm';
import { BaseMetricsEntity } from './base.metrics.entity';

@Entity('ad_metrics')
export class AdMetrics extends BaseMetricsEntity {
  @Column({ name: 'adgroup_id', type: 'varchar' })
  adGroupId: string;

  @Column({ name: 'ad_id', type: 'varchar' })
  adId: string;
}
