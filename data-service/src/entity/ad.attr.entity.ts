import { Column, Entity } from 'typeorm';
import { BaseAttr } from './base.attr.entity';

@Entity('ad_attr')
export class AdAttr extends BaseAttr {
  @Column({ name: 'campaign_id', type: 'varchar' })
  campaignId: string;

  @Column({ name: 'adgroup_id', type: 'varchar' })
  adgroupId: string;

  @Column({ name: 'ad_id', type: 'varchar' })
  adId: string;

  @Column({ name: 'type' })
  type: string;

  @Column({ name: 'device_preference', nullable: true })
  devicePreference: string;

  @Column({ name: 'display_url', nullable: true })
  displayUrl: string;

  @Column('text', { array: true, name: 'final_mobile_urls', nullable: true })
  finalMobileUrls: string[];

  @Column('text', { array: true, name: 'final_urls', nullable: true })
  finalUrls: string[];

  @Column({ name: 'call_ad_business_name', nullable: true })
  callAdBusinessName: string;

  /** Call Ads */

  @Column({ name: 'call_ad_call_tracked', nullable: true })
  callAdTracked: boolean;

  @Column({ name: 'call_ad_conversion_action', nullable: true })
  callAdConversionAction: string;

  @Column({ name: 'call_ad_conversion_reporting_state', nullable: true })
  callAdConversionReportingState: string;

  @Column({ name: 'call_ad_country_code', nullable: true })
  countryCode: string;

  @Column({ name: 'call_ad_description1', nullable: true })
  callAdDescription1: string;

  @Column({ name: 'call_ad_description2', nullable: true })
  callAdDescription2: string;

  @Column({ name: 'call_ad_disable_call_conversion', nullable: true })
  callAdDisableCallConversion: boolean;

  @Column({ name: 'call_ad_headline1', nullable: true })
  callAdHeadline1: string;

  @Column({ name: 'call_ad_headline2', nullable: true })
  callAdHeadline2: string;

  @Column({ name: 'call_ad_path1', nullable: true })
  callAdPath1: string;

  @Column({ name: 'call_ad_path2', nullable: true })
  callAdPath2: string;

  @Column({ name: 'call_ad_phone_number', nullable: true })
  callAdPhoneNumber: string;

  @Column({ name: 'call_ad_phone_number_verification_url', nullable: true })
  callAdPhoneNumberVerificationUrl: string;

  /** Expanded Text Ads */

  @Column({ name: 'expanded_text_ad_description1', nullable: true })
  expandedTextAdAdDescription1: string;

  @Column({ name: 'expanded_text_ad_description2', nullable: true })
  expandedTextAdDescription2: string;

  @Column({ name: 'expanded_text_ad_headline_part1', nullable: true })
  expandedTextAdHeadlinePart1: string;

  @Column({ name: 'expanded_text_ad_headline_part2', nullable: true })
  expandedTextAdHeadlinePart2: string;

  @Column({ name: 'expanded_text_ad_headline_part3', nullable: true })
  expandedTextAdHeadlinePart3: string;

  @Column({ name: 'expanded_text_ad_path1', nullable: true })
  expandedTextAdPath1: string;

  @Column({ name: 'expanded_text_ad_path2', nullable: true })
  expandedTextAdPath2: string;

  /** Image Ad */
  @Column({ name: 'image_ad_asset', nullable: true })
  imageAdAsset: string;

  @Column({ name: 'image_ad_image_url', nullable: true })
  imageAdImageUrl: string;

  @Column({ name: 'image_ad_mime_type', nullable: true })
  imageAdMimeType: string;

  @Column({ name: 'image_ad_name', nullable: true })
  imageAdName: string;

  @Column({ name: 'image_ad_pixel_height', nullable: true })
  imageAdPixelHeight: number;

  @Column({ name: 'image_ad_pixel_width', nullable: true })
  imageAdPixelWidth: number;

  @Column({ name: 'image_ad_preview_image_url', nullable: true })
  imageAdPreviewImageUrl: string;

  @Column({ name: 'image_ad_preview_pixel_height', nullable: true })
  imageAdPreviewPixelHeight: number;

  @Column({ name: 'image_ad_preview_pixel_width', nullable: true })
  imageAdPreviewPixelWidth: number;

  /** Responsive Display Ad */

  @Column({ name: 'responsive_display_ad_accent_color', nullable: true })
  responsiveDisplayAdAccent: string;

  @Column({
    name: 'responsive_display_ad_allow_flexible_color',
    nullable: true,
  })
  responsiveDisplayAdAllowFlexibleColor: boolean;

  @Column({ name: 'responsive_display_ad_call_to_action_text', nullable: true })
  responsiveDisplayAdCallToActionText: string;

  @Column({ name: 'responsive_display_ad_business_name', nullable: true })
  responsiveDisplayAdBusinessName: string;

  @Column({
    name: 'responsive_display_ad_enable_asset_enhancements',
    nullable: true,
  })
  responsiveDisplayAdEnableAssetEnhancements: boolean;

  @Column({ name: 'responsive_display_enable_autogen_video', nullable: true })
  responsiveDisplayAdEnableAutogenVideo: boolean;

  @Column('text', {
    array: true,
    name: 'responsive_display_ad_descriptions',
    nullable: true,
  })
  responsiveDisplayAdDescriptions: string[];

  @Column({ name: 'responsive_display_ad_format_setting', nullable: true })
  responsiveDisplayAdFormatSetting: string;

  @Column('text', {
    array: true,
    name: 'responsive_display_ad_logo_images',
    nullable: true,
  })
  responsiveDisplayAdLogoImages: string[];

  @Column({ name: 'responsive_display_ad_long_headline', nullable: true })
  responsiveDisplayAdLongHeadline: string;

  @Column({ name: 'responsive_display_ad_main_color', nullable: true })
  responsiveDisplayAdMainColor: string;

  @Column('text', {
    array: true,
    name: 'responsive_display_ad_marketing_images',
    nullable: true,
  })
  responsiveDisplayAdMarketingImages: string[];

  @Column({ name: 'responsive_display_ad_price_prefix', nullable: true })
  responsiveDisplayAdPricePrefix: string;

  @Column({ name: 'responsive_display_ad_promo_text', nullable: true })
  responsiveDisplayAdPromoText: string;

  @Column('text', {
    array: true,
    name: 'responsive_display_ad_square_logo_images',
    nullable: true,
  })
  responsiveDisplayAdSquareLogoImages: string[];

  @Column('text', {
    array: true,
    name: 'responsive_display_ad_square_marketing_images',
    nullable: true,
  })
  responsiveDisplayAdSquareMarketingImages: string[];

  @Column('text', {
    array: true,
    name: 'responsive_display_ad_youtube_videos',
    nullable: true,
  })
  responsiveDisplayAdYoutubeVideos: string[];

  /** Responsive Search Ad */

  @Column('text', {
    array: true,
    name: 'responsive_search_ad_descriptions',
    nullable: true,
  })
  responsiveSearchAdDescriptions: string[];

  @Column('text', {
    array: true,
    name: 'responsive_search_ad_headlines',
    nullable: true,
  })
  responsiveSearchAdHeadlines: string[];

  @Column({ name: 'responsive_search_ad_path_1', nullable: true })
  responsiveSearchAdPath1: string;

  @Column({ name: 'responsive_search_ad_path_2', nullable: true })
  responsiveSearchAdPath2: string;

  /** Smart Campaign Ad */

  @Column('text', {
    array: true,
    name: 'smart_campaign_ad_headlines',
    nullable: true,
  })
  smartCampaignAdHeadlines: string[];

  @Column('text', {
    array: true,
    name: 'smart_campaign_ad_descriptions',
    nullable: true,
  })
  smartCampaignAdDescriptions: string[];

  /** Text Ad */

  @Column({ name: 'text_ad_headline', nullable: true })
  textAdHeadline: string;

  @Column({ name: 'text_ad_description1', nullable: true })
  textAdDescription1: string;

  @Column({ name: 'text_ad_description2', nullable: true })
  textAdDescription2: string;

  /** Video Ad Bumper */

  @Column({ name: 'video_ad_bumper_action_button_label', nullable: true })
  videoAdBumperActionButtonLabel: string;

  @Column({ name: 'video_ad_bumper_action_headline', nullable: true })
  videoAdBumperActionHeadline: string;

  @Column({ name: 'video_ad_bumper_companion_banner_asset', nullable: true })
  videoAdBumberCompanionBannerAsset: string;

  /** Video Ad In Feed */

  @Column({ name: 'video_ad_in_feed_desctipion1', nullable: true })
  videoAdInFeedDescription1: string;

  @Column({ name: 'video_ad_in_feed_desctipion2', nullable: true })
  videoAdInFeedDescription2: string;

  @Column({ name: 'video_ad_in_feed_headline', nullable: true })
  videoAdInFeedHeadline: string;

  @Column({ name: 'video_ad_in_feed_thumbnail', nullable: true })
  videoAdInFeedThumbnail: string;

  /** Video Ad In Stream */

  @Column({ name: 'video_ad_in_stream_action_button_label', nullable: true })
  videoAdInStreamActionButtonLabel: string;

  @Column({ name: 'video_ad_in_stream_action_headline', nullable: true })
  videoAdInStreamActionHeadline: string;

  @Column({ name: 'video_ad_in_stream_companion_banner_asset', nullable: true })
  videoAdInStreamCompanionBannerAsset: string;

  /** Video Ad Non Skippable */

  @Column({
    name: 'video_ad_non_skippable_action_button_label',
    nullable: true,
  })
  videoAdNonSkippableActionButtonLabel: string;

  @Column({ name: 'video_ad_non_skippable_action_headline', nullable: true })
  videoAdNonSkippableActionHeadline: string;

  @Column({
    name: 'video_ad_non_skippable_companion_banner_asset',
    nullable: true,
  })
  videoAdNonSkippableCompanionBannerAsset: string;

  /** Video Ad Out Stream */

  @Column({ name: 'video_ad_out_stream_description', nullable: true })
  videoAdOutStreamDescription: string;

  @Column({ name: 'video_ad_out_stream_headline', nullable: true })
  videoAdOutStreamHeadline: string;

  /** Video Asset */

  @Column({ name: 'video_asset', nullable: true })
  videoAsset: string;

  /** Video Responsive Ad */

  @Column({ name: 'video_responsive_ad_breadcrumb1', nullable: true })
  videoResponsiveAdBreadcrumb1: string;

  @Column({ name: 'video_responsive_ad_breadcrumb2', nullable: true })
  videoResponsiveAdBreadcrumb2: string;

  @Column('text', {
    array: true,
    name: 'video_responsive_ad_call_to_actions',
    nullable: true,
  })
  videoResponsiveAdCallToActions: string[];

  @Column('text', {
    array: true,
    name: 'video_responsive_ad_companion_banners',
    nullable: true,
  })
  videoResponsiveAdCompanionBanners: string[];

  @Column('text', {
    array: true,
    name: 'video_responsive_ad_descriptions',
    nullable: true,
  })
  videoResponsiveAdDescriptions: string[];

  @Column('text', {
    array: true,
    name: 'video_responsive_ad_headlines',
    nullable: true,
  })
  videoResponsiveAdHeadlines: string[];

  @Column('text', {
    array: true,
    name: 'video_responsive_ad_long_headlines',
    nullable: true,
  })
  videoResponsiveAdLongHeadlines: string[];

  @Column('text', {
    array: true,
    name: 'video_responsive_ad_videos',
    nullable: true,
  })
  videoResponsiveAdVideos: string[];
}
