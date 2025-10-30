import { IsBoolean, IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';
import { enums } from 'google-ads-api';
import { AccountAttr } from '../entity/account.attr.entity';

export class CallReportingSettingDTO {
  @IsBoolean()
  call_reporting_enabled: boolean;

  @IsBoolean()
  call_conversion_reporting_enabled: boolean;
}

export class ConversionTrackingSettingDTO {
  @IsString()
  conversion_tracking_id: string;

  @IsString()
  conversion_tracking_status: string;
}

export class RemarketingSettingDTO {
  @IsString()
  google_global_site_tag: string;
}

export class AccountAttrDTO {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  descriptive_name: string;

  @IsBoolean()
  manager: boolean;

  @IsString()
  currency_code: string;

  @IsString()
  time_zone: string;

  @IsNumber()
  status: number;

  @IsObject()
  call_reporting_setting: CallReportingSettingDTO;

  @IsObject()
  conversion_tracking_setting: ConversionTrackingSettingDTO;

  @IsObject()
  remarketing_setting: RemarketingSettingDTO;

  @IsNumber()
  optimization_score?: number;

  static toEntity(userId: number, customerId: string, row: any): AccountAttr {
    const accountAttrDto: AccountAttrDTO = row.customer;

    const accountEntity = new AccountAttr();
    accountEntity.userId = userId;
    accountEntity.customerId = accountAttrDto.id;
    accountEntity.accountName = accountAttrDto.descriptive_name;
    accountEntity.isManager = accountAttrDto.manager;
    accountEntity.status = enums.CustomerStatus[accountAttrDto.status];
    accountEntity.currencyCode = accountAttrDto.currency_code;
    accountEntity.timeZone = accountAttrDto.time_zone;
    accountEntity.isCallReportingEnabled =
      accountAttrDto.call_reporting_setting.call_reporting_enabled;
    accountEntity.isCallConversionReportingEnabled =
      accountAttrDto.call_reporting_setting.call_conversion_reporting_enabled;
    accountEntity.conversionTrackingId =
      accountAttrDto.conversion_tracking_setting.conversion_tracking_id;
    accountEntity.conversionTrackingStatus =
      enums.ConversionTrackingStatus[
        accountAttrDto.conversion_tracking_setting.conversion_tracking_status
      ];
    accountEntity.remarketingTag = accountAttrDto.remarketing_setting.google_global_site_tag;

    return accountEntity;
  }
}
