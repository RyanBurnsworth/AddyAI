import { Column, Entity } from 'typeorm';
import { BaseAttr } from './base.attr.entity';

@Entity('account_attr')
export class AccountAttr extends BaseAttr {
  @Column({ name: 'account_name' })
  accountName: string;

  @Column({ name: 'manager' })
  isManager: boolean;

  @Column({ name: 'currency_code' })
  currencyCode: string;

  @Column({ name: 'time_zone' })
  timeZone: string;

  @Column({ name: 'call_reporting_enabled' })
  isCallReportingEnabled: boolean;

  @Column({ name: 'call_conversion_reporting_enabled' })
  isCallConversionReportingEnabled: boolean;

  @Column({ name: 'conversion_tracking_id' })
  conversionTrackingId: string;

  @Column({ name: 'conversion_tracking_status' })
  conversionTrackingStatus: string;

  @Column({ name: 'remarketing_tag' })
  remarketingTag: string;
}
