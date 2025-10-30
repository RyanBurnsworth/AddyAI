import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleService } from '../google/google.service';
import { DataService } from '../data/data.service';
import { SyncRequest as SyncRequest } from '../../model/sync.request.model';
import {
  ACCOUNT_ATTR_QUERY,
  AD_ATTR_QUERY,
  AD_METRICS_QUERY,
  ADGROUP_ATTR_QUERY,
  ADGROUP_METRICS_QUERY,
  CAMPAIGN_ATTR_QUERY,
  CAMPAIGN_METRICS_QUERY,
  KEYWORD_ATTR_QUERY,
  KEYWORD_METRICS_QUERY,
} from '../../util/queries';
import { AccountAttrDTO } from '../../dto/account.attr.dto';
import { CampaignAttrDTO } from '../../dto/campaign.attr.dto';
import { AdGroupAttrDTO } from '../../dto/adgroup.attr.dto';
import { AdGroupAdDTO } from '../../dto/ad.attr.dto';
import { KeywordAttrDTO } from '../../dto/keyword.attr.dto';
import { HelperUtil } from '../../util/helper.util';
import { CampaignMetricsDTO } from '../../dto/campaign.metrics.dto';
import { AdGroupMetricsDTO } from '../../dto/adgroup.metrics.dto';
import { AdMetricsDTO } from '../../dto/ad.metrics.dto';
import { KeywordMetricsDTO } from '../../dto/keyword.metrics.dto';

@Injectable()
export class SyncService {
  private singleRecordSyncMap: SyncDefinition[] = [
    {
      query: ACCOUNT_ATTR_QUERY,
      targetTable: 'account_attr',
      dto: AccountAttrDTO,
    },
    {
      query: CAMPAIGN_ATTR_QUERY,
      targetTable: 'campaign_attr',
      dto: CampaignAttrDTO,
    },
    {
      query: ADGROUP_ATTR_QUERY,
      targetTable: 'adgroup_attr',
      dto: AdGroupAttrDTO,
    },
    {
      query: AD_ATTR_QUERY,
      targetTable: 'ad_attr',
      dto: AdGroupAdDTO,
    },
    {
      query: KEYWORD_ATTR_QUERY,
      targetTable: 'keyword_attr',
      dto: KeywordAttrDTO,
    },
  ];

  // Map query constants to corresponding DTO classes and DB table names
  metricsSyncMap: SyncDefinition[] = [
    {
      query: CAMPAIGN_METRICS_QUERY,
      dto: CampaignMetricsDTO,
      targetTable: 'campaign_metrics',
    },
    {
      query: ADGROUP_METRICS_QUERY,
      dto: AdGroupMetricsDTO,
      targetTable: 'adgroup_metrics',
    },
    {
      query: AD_METRICS_QUERY,
      dto: AdMetricsDTO,
      targetTable: 'ad_metrics',
    },
    {
      query: KEYWORD_METRICS_QUERY,
      dto: KeywordMetricsDTO,
      targetTable: 'keyword_metrics',
    },
  ];

  constructor(
    private readonly googleService: GoogleService,
    private readonly dataService: DataService
  ) {}

  /**
   * Synchronize attribute data from Google Ads with the Postgres db
   *
   * @param syncRequest a SyncRequest object
   */
  async performAttributeSync(syncRequest: SyncRequest) {
    for (const { query, targetTable, dto } of this.singleRecordSyncMap) {
      try {
        const result = await this.googleService.executeQuery(
          syncRequest.customerId,
          syncRequest.refreshToken,
          query,
          syncRequest.loginCustomerId
        );

        const entities = result.map(row => {
          return dto.toEntity(syncRequest.userId, syncRequest.customerId, row);
        });

        await this.dataService.genericSave(entities, targetTable);
      } catch (error) {
        console.log('Error performing synchronization: ', error);
        throw error;
      }
    }
  }

  /**
   * Synchronize metrics data from Google Ads with the Postgres db
   *
   * @param syncRequest a SyncRequest object
   */
  async performMetricSync(syncRequest: SyncRequest) {
    try {
      const dates = HelperUtil.getMonthlyDateRanges();

      // Prepare all queries for all dates and metric types
      const queriesWithMetadata = dates.flatMap(date =>
        this.metricsSyncMap.map(config => ({
          query: HelperUtil.createMetricsQuery(date.start, date.end, config.query),
          dto: config.dto,
          table: config.targetTable,
        }))
      );

      // Execute all queries in parallel
      const results = await Promise.all(
        queriesWithMetadata.map(({ query }) =>
          this.googleService.executeQuery(
            syncRequest.customerId,
            syncRequest.refreshToken,
            query,
            syncRequest.loginCustomerId
          )
        )
      );

      // results is an array with results matching queriesWithMetadata index
      // For each result set, transform to entity using the proper DTO and save separately
      for (let i = 0; i < results.length; i++) {
        const rows = results[i];
        const { dto, table } = queriesWithMetadata[i];

        const metricEntities = rows.map(row =>
          dto.toEntity(syncRequest.userId, syncRequest.customerId, row)
        );

        await this.dataService.genericSave(metricEntities, table);
        console.log(`Saved ${metricEntities.length} records to ${table} table.`);
      }

      this.dataService.updateLastSynced(syncRequest.customerId);
    } catch (error) {
      console.error('Error performing metric sync:', error);
      throw new InternalServerErrorException('Error performing synchronization');
    }
  }
}
