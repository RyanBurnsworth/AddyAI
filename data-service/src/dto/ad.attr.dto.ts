import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AdAttr } from '../entity/ad.attr.entity';
import { enums } from 'google-ads-api';

class CallAdDTO {
  @IsOptional() @IsString() business_name?: string;
  @IsOptional() @IsBoolean() call_tracked?: boolean;
  @IsOptional() @IsString() conversion_action?: string;
  @IsOptional() @IsString() conversion_reporting_state?: string;
  @IsOptional() @IsString() country_code?: string;
  @IsOptional() @IsString() description1?: string;
  @IsOptional() @IsString() description2?: string;
  @IsOptional() @IsBoolean() disable_call_conversion?: boolean;
  @IsOptional() @IsString() headline1?: string;
  @IsOptional() @IsString() headline2?: string;
  @IsOptional() @IsString() path1?: string;
  @IsOptional() @IsString() path2?: string;
  @IsOptional() @IsString() phone_number?: string;
  @IsOptional() @IsString() phone_number_verification_url?: string;
}

class ExpandedTextAdDTO {
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() description2?: string;
  @IsOptional() @IsString() headline_part1?: string;
  @IsOptional() @IsString() headline_part2?: string;
  @IsOptional() @IsString() headline_part3?: string;
  @IsOptional() @IsString() path1?: string;
  @IsOptional() @IsString() path2?: string;
}

class ImageAdDTO {
  @IsOptional() @IsString() asset?: string;
  @IsOptional() @IsString() image_url?: string;
  @IsOptional() @IsString() mime_type?: string;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsNumber() pixel_height?: number;
  @IsOptional() @IsNumber() pixel_width?: number;
  @IsOptional() @IsString() preview_image_url?: string;
  @IsOptional() @IsNumber() preview_pixel_height?: number;
  @IsOptional() @IsNumber() preview_pixel_width?: number;
}

class ResponsiveDisplayAdDTO {
  @IsOptional() @IsString() accent_color?: string;
  @IsOptional() @IsBoolean() allow_flexible_color?: boolean;
  @IsOptional() @IsString() call_to_action_text?: string;
  @IsOptional() @IsString() business_name?: string;
  @IsOptional() @IsBoolean() enable_asset_enhancements?: boolean;
  @IsOptional() @IsBoolean() enable_autogen_video?: boolean;
  @IsOptional() @IsArray() descriptions?: string[];
  @IsOptional() @IsString() format_setting?: string;
  @IsOptional() @IsArray() headlines?: string[];
  @IsOptional() @IsArray() logo_images?: string[];
  @IsOptional() @IsString() long_headline?: string;
  @IsOptional() @IsString() main_color?: string;
  @IsOptional() @IsArray() marketing_images?: string[];
  @IsOptional() @IsString() price_prefix?: string;
  @IsOptional() @IsString() promo_text?: string;
  @IsOptional() @IsArray() square_logo_images?: string[];
  @IsOptional() @IsArray() square_marketing_images?: string[];
  @IsOptional() @IsArray() youtube_videos?: string[];
}

// Responsive Search Ad
export class ResponsiveSearchAdDTO {
  @IsOptional() @IsArray() @IsString({ each: true }) descriptions?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) headlines?: string[];
  @IsOptional() @IsString() path1?: string;
  @IsOptional() @IsString() path2?: string;
}

// Smart Campaign Ad
export class SmartCampaignAdDTO {
  @IsOptional() @IsArray() @IsString({ each: true }) descriptions?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) headlines?: string[];
}

// Text Ad
export class TextAdDTO {
  @IsOptional() @IsString() description1?: string;
  @IsOptional() @IsString() description2?: string;
  @IsOptional() @IsString() headline?: string;
}

// Video Ad Types
export class VideoAdBumperDTO {
  @IsOptional() @IsString() action_button_label?: string;
  @IsOptional() @IsString() action_headline?: string;
  @IsOptional() @IsString() companion_banner_asset?: string;
}

export class VideoAdInFeedDTO {
  @IsOptional() @IsString() description1?: string;
  @IsOptional() @IsString() description2?: string;
  @IsOptional() @IsString() headline?: string;
  @IsOptional() @IsString() thumbnail?: string;
}

export class VideoAdInStreamDTO {
  @IsOptional() @IsString() action_button_label?: string;
  @IsOptional() @IsString() action_headline?: string;
  @IsOptional() @IsString() companion_banner_asset?: string;
}

export class VideoAdNonSkippableDTO {
  @IsOptional() @IsString() action_button_label?: string;
  @IsOptional() @IsString() action_headline?: string;
  @IsOptional() @IsString() companion_banner_asset?: string;
}

export class VideoAdOutStreamDTO {
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() headline?: string;
}

export class VideoAssetDTO {
  @IsOptional() @IsString() asset?: string;
}

// Video Responsive Ad
export class VideoResponsiveAdDTO {
  @IsOptional() @IsString() breadcrumb1?: string;
  @IsOptional() @IsString() breadcrumb2?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) call_to_actions?: string[];
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  companion_banners?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) descriptions?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) headlines?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) long_headlines?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) videos?: string[];
}

export class VideoAdDTO {
  @IsOptional()
  @ValidateNested()
  @Type(() => VideoAdBumperDTO)
  bumper?: VideoAdBumperDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => VideoAdInFeedDTO)
  in_feed?: VideoAdInFeedDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => VideoAdInStreamDTO)
  in_stream?: VideoAdInStreamDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => VideoAdNonSkippableDTO)
  non_skippable?: VideoAdNonSkippableDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => VideoAdOutStreamDTO)
  out_stream?: VideoAdOutStreamDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => VideoAssetDTO)
  video?: VideoAssetDTO;
}

export class Ad {
  @IsString() id: string;
  @IsNumber() type: number;
  @IsOptional() @IsString() device_preference?: string;
  @IsOptional() @IsString() display_url?: string;
  @IsOptional() @IsArray() final_mobile_urls?: string[];
  @IsOptional() @IsArray() final_urls?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CallAdDTO)
  call_ad?: CallAdDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => ExpandedTextAdDTO)
  expanded_text_ad?: ExpandedTextAdDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => ImageAdDTO)
  image_ad?: ImageAdDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => ResponsiveDisplayAdDTO)
  responsive_display_ad?: ResponsiveDisplayAdDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => ResponsiveSearchAdDTO)
  responsive_search_ad?: ResponsiveSearchAdDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => SmartCampaignAdDTO)
  smart_ad_campaign_ad?: SmartCampaignAdDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => TextAdDTO)
  text_ad?: TextAdDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => VideoAdDTO)
  video_ad?: VideoAdDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => VideoResponsiveAdDTO)
  video_responsive_ad?: VideoResponsiveAdDTO;
}

export class AdGroupAdDTO {
  @IsString() name: string;
  @IsString() ad_group: string;
  @IsString() resource_name: string;
  @IsNumber() status: number;
  ad: Ad;

  static toEntity(userId: number, customerId: string, row: any): AdAttr {
    const adAttrDto: AdGroupAdDTO = row.ad_group_ad;
    const campaign = row.campaign || {};
    const adgroup = row.ad_group || {};

    const adAttr = new AdAttr();
    adAttr.userId = userId;
    adAttr.customerId = customerId;
    adAttr.campaignId = campaign.id;
    adAttr.adgroupId = adgroup.id;
    adAttr.status = enums.AdGroupAdStatus[adAttrDto.status];

    adAttr.adId = adAttrDto.ad.id;
    adAttr.type = enums.AdType[adAttrDto.ad.type];
    adAttr.devicePreference = adAttrDto.ad.device_preference;
    adAttr.displayUrl = adAttrDto.ad.display_url;
    adAttr.finalMobileUrls = adAttrDto.ad.final_mobile_urls;
    adAttr.finalUrls = adAttrDto.ad.final_urls;

    adAttr.callAdBusinessName = adAttrDto.ad.call_ad?.business_name;
    adAttr.callAdConversionAction = adAttrDto.ad.call_ad?.conversion_action;
    adAttr.callAdTracked = adAttrDto.ad.call_ad?.call_tracked;
    adAttr.callAdConversionReportingState = adAttrDto.ad.call_ad?.conversion_reporting_state;
    adAttr.countryCode = adAttrDto.ad.call_ad?.country_code;
    adAttr.callAdDescription1 = adAttrDto.ad.call_ad?.description1;
    adAttr.callAdDescription2 = adAttrDto.ad.call_ad?.description2;
    adAttr.callAdDisableCallConversion = adAttrDto.ad.call_ad?.disable_call_conversion;
    adAttr.callAdHeadline1 = adAttrDto.ad.call_ad?.headline1;
    adAttr.callAdHeadline2 = adAttrDto.ad.call_ad?.headline2;
    adAttr.callAdPath1 = adAttrDto.ad.call_ad?.path1;
    adAttr.callAdPath2 = adAttrDto.ad.call_ad?.path2;
    adAttr.callAdPhoneNumber = adAttrDto.ad.call_ad?.phone_number;
    adAttr.callAdPhoneNumberVerificationUrl = adAttrDto.ad.call_ad?.phone_number_verification_url;

    adAttr.expandedTextAdAdDescription1 = adAttrDto.ad.expanded_text_ad?.description;
    adAttr.expandedTextAdDescription2 = adAttrDto.ad.expanded_text_ad?.description2;
    adAttr.expandedTextAdHeadlinePart1 = adAttrDto.ad.expanded_text_ad?.headline_part1;
    adAttr.expandedTextAdHeadlinePart2 = adAttrDto.ad.expanded_text_ad?.headline_part2;
    adAttr.expandedTextAdHeadlinePart3 = adAttrDto.ad.expanded_text_ad?.headline_part3;
    adAttr.expandedTextAdPath1 = adAttrDto.ad.expanded_text_ad?.path1;
    adAttr.expandedTextAdPath2 = adAttrDto.ad.expanded_text_ad?.path2;

    adAttr.imageAdAsset = adAttrDto.ad.image_ad?.asset;
    adAttr.imageAdImageUrl = adAttrDto.ad.image_ad?.image_url;
    adAttr.imageAdMimeType = adAttrDto.ad.image_ad?.mime_type;
    adAttr.imageAdName = adAttrDto.ad.image_ad?.name;
    adAttr.imageAdPixelHeight = adAttrDto.ad.image_ad?.pixel_height;
    adAttr.imageAdPixelWidth = adAttrDto.ad.image_ad?.pixel_width;
    adAttr.imageAdPreviewImageUrl = adAttrDto.ad.image_ad?.preview_image_url;
    adAttr.imageAdPreviewPixelHeight = adAttrDto.ad.image_ad?.preview_pixel_height;
    adAttr.imageAdPreviewPixelWidth = adAttrDto.ad.image_ad?.preview_pixel_width;

    adAttr.responsiveDisplayAdAccent = adAttrDto.ad.responsive_display_ad?.accent_color;
    adAttr.responsiveDisplayAdAllowFlexibleColor =
      adAttrDto.ad.responsive_display_ad?.allow_flexible_color;
    adAttr.responsiveDisplayAdCallToActionText =
      adAttrDto.ad.responsive_display_ad?.call_to_action_text;
    adAttr.responsiveDisplayAdBusinessName = adAttrDto.ad.responsive_display_ad?.business_name;
    adAttr.responsiveDisplayAdEnableAssetEnhancements =
      adAttrDto.ad.responsive_display_ad?.enable_asset_enhancements;
    adAttr.responsiveDisplayAdEnableAutogenVideo =
      adAttrDto.ad.responsive_display_ad?.enable_autogen_video;
    adAttr.responsiveDisplayAdDescriptions = adAttrDto.ad.responsive_display_ad?.descriptions;
    adAttr.responsiveDisplayAdCallToActionText =
      adAttrDto.ad.responsive_display_ad?.call_to_action_text;
    adAttr.responsiveDisplayAdFormatSetting = adAttrDto.ad.responsive_display_ad?.format_setting;
    adAttr.responsiveDisplayAdLogoImages = adAttrDto.ad.responsive_display_ad?.logo_images;
    adAttr.responsiveDisplayAdLongHeadline = adAttrDto.ad.responsive_display_ad?.long_headline;
    adAttr.responsiveDisplayAdMainColor = adAttrDto.ad.responsive_display_ad?.main_color;
    adAttr.responsiveDisplayAdMarketingImages =
      adAttrDto.ad.responsive_display_ad?.marketing_images;
    adAttr.responsiveDisplayAdPricePrefix = adAttrDto.ad.responsive_display_ad?.price_prefix;
    adAttr.responsiveDisplayAdPromoText = adAttrDto.ad.responsive_display_ad?.promo_text;
    adAttr.responsiveDisplayAdSquareLogoImages =
      adAttrDto.ad.responsive_display_ad?.square_logo_images;
    adAttr.responsiveDisplayAdSquareMarketingImages =
      adAttrDto.ad.responsive_display_ad?.square_marketing_images;
    adAttr.responsiveDisplayAdYoutubeVideos = adAttrDto.ad.responsive_display_ad?.youtube_videos;

    adAttr.responsiveSearchAdDescriptions = adAttrDto.ad.responsive_search_ad?.descriptions;
    adAttr.responsiveSearchAdHeadlines = adAttrDto.ad.responsive_search_ad?.headlines;
    adAttr.responsiveSearchAdPath1 = adAttrDto.ad.responsive_search_ad?.path1;
    adAttr.responsiveSearchAdPath2 = adAttrDto.ad.responsive_search_ad?.path2;

    adAttr.smartCampaignAdHeadlines = adAttrDto.ad.smart_ad_campaign_ad?.headlines;
    adAttr.smartCampaignAdDescriptions = adAttrDto.ad.smart_ad_campaign_ad?.descriptions;

    adAttr.textAdHeadline = adAttrDto.ad.text_ad?.headline;
    adAttr.textAdDescription1 = adAttrDto.ad.text_ad?.description1;
    adAttr.textAdDescription2 = adAttrDto.ad.text_ad?.description2;

    adAttr.videoAdBumperActionButtonLabel = adAttrDto.ad.video_ad?.bumper?.action_button_label;
    adAttr.videoAdBumperActionHeadline = adAttrDto.ad.video_ad?.bumper?.action_headline;
    adAttr.videoAdBumberCompanionBannerAsset =
      adAttrDto.ad.video_ad?.bumper?.companion_banner_asset;

    adAttr.videoAdInFeedHeadline = adAttrDto.ad.video_ad?.in_feed?.headline;
    adAttr.videoAdInFeedDescription1 = adAttrDto.ad.video_ad?.in_feed?.description1;
    adAttr.videoAdInFeedDescription2 = adAttrDto.ad.video_ad?.in_feed?.description2;
    adAttr.videoAdInFeedThumbnail = adAttrDto.ad.video_ad?.in_feed?.thumbnail;

    adAttr.videoAdInStreamActionButtonLabel = adAttrDto.ad.video_ad?.in_stream?.action_button_label;
    adAttr.videoAdInStreamActionHeadline = adAttrDto.ad.video_ad?.in_stream?.action_headline;
    adAttr.videoAdInStreamCompanionBannerAsset =
      adAttrDto.ad.video_ad?.in_stream?.companion_banner_asset;

    adAttr.videoAdNonSkippableActionButtonLabel =
      adAttrDto.ad.video_ad?.non_skippable?.action_button_label;
    adAttr.videoAdNonSkippableActionHeadline =
      adAttrDto.ad.video_ad?.non_skippable?.action_headline;
    adAttr.videoAdNonSkippableCompanionBannerAsset =
      adAttrDto.ad.video_ad?.non_skippable?.companion_banner_asset;

    adAttr.videoAdOutStreamDescription = adAttrDto.ad.video_ad?.out_stream?.description;
    adAttr.videoAdOutStreamHeadline = adAttrDto.ad.video_ad?.out_stream?.headline;

    adAttr.videoAsset = adAttrDto.ad.video_ad?.video.asset;

    adAttr.videoResponsiveAdBreadcrumb1 = adAttrDto.ad.video_responsive_ad?.breadcrumb1;
    adAttr.videoResponsiveAdBreadcrumb2 = adAttrDto.ad.video_responsive_ad?.breadcrumb2;
    adAttr.videoResponsiveAdCallToActions = adAttrDto.ad.video_responsive_ad?.call_to_actions;
    adAttr.videoResponsiveAdCompanionBanners = adAttrDto.ad.video_responsive_ad?.companion_banners;
    adAttr.videoResponsiveAdDescriptions = adAttrDto.ad.video_responsive_ad?.descriptions;
    adAttr.videoResponsiveAdHeadlines = adAttrDto.ad.video_responsive_ad?.headlines;
    adAttr.videoResponsiveAdLongHeadlines = adAttrDto.ad.video_responsive_ad?.long_headlines;
    adAttr.videoResponsiveAdVideos = adAttrDto.ad.video_responsive_ad?.videos;

    return adAttr;
  }
}
