import { Test, TestingModule } from '@nestjs/testing';
import { SyncService } from './sync.service';
import { GoogleService } from '../google/google.service';
import { DataService } from '../data/data.service';
import { InternalServerErrorException } from '@nestjs/common';
import { SyncRequest } from '../../model/sync.request.model';
import { HelperUtil } from '../../util/helper.util';

jest.mock('../../util/helper.util');

describe('SyncService', () => {
  let service: SyncService;
  let googleService: GoogleService;
  let dataService: DataService;

  const mockGoogleService = {
    executeQuery: jest.fn(),
  };

  const mockDataService = {
    genericSave: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SyncService,
        { provide: GoogleService, useValue: mockGoogleService },
        { provide: DataService, useValue: mockDataService },
      ],
    }).compile();

    service = module.get<SyncService>(SyncService);
    googleService = module.get<GoogleService>(GoogleService);
    dataService = module.get<DataService>(DataService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('performSync', () => {
    it('should call googleService and dataService for each sync definition', async () => {
      const mockResult = [{ foo: 'bar' }];
      const syncRequest: SyncRequest = {
        userId: 1,
        customerId: '123',
        refreshToken: 'token',
        loginCustomerId: 'manager123',
      };

      // Mock executeQuery return
      mockGoogleService.executeQuery.mockResolvedValue(mockResult);

      // Mock DTO transformation for each sync type
      service['singleRecordSyncMap'].forEach(def => {
        def.dto.toEntity = jest.fn().mockReturnValue({ ...mockResult[0] });
      });

      await service.performAttributeSync(syncRequest);

      expect(mockGoogleService.executeQuery).toHaveBeenCalledTimes(
        service['singleRecordSyncMap'].length
      );
      expect(mockDataService.genericSave).toHaveBeenCalledTimes(
        service['singleRecordSyncMap'].length
      );
    });

    it('should throw InternalServerErrorException on query failure', async () => {
      mockGoogleService.executeQuery.mockRejectedValue(new Error('Failed'));

      const syncRequest: SyncRequest = {
        userId: 1,
        customerId: '123',
        refreshToken: 'token',
        loginCustomerId: 'manager123',
      };

      await expect(service.performAttributeSync(syncRequest)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('performMetricSync', () => {
    it('should generate queries and call googleService.executeQuery', async () => {
      const syncRequest: SyncRequest = {
        userId: 1,
        customerId: '123',
        refreshToken: 'token',
        loginCustomerId: 'manager123',
      };

      const mockDateRanges = [{ start: '2024-01-01', end: '2024-01-31' }];
      const mockQuery = 'SELECT metrics.impressions FROM campaign';
      const mockResult = [{ campaign: { id: 'abc' }, metrics: { impressions: 100 } }];

      (HelperUtil.getMonthlyDateRanges as jest.Mock).mockReturnValue(mockDateRanges);
      (HelperUtil.createMetricsQuery as jest.Mock).mockReturnValue(mockQuery);
      mockGoogleService.executeQuery.mockResolvedValue(mockResult);

      await service.performMetricSync(syncRequest);

      expect(mockGoogleService.executeQuery).toHaveBeenCalled();
      expect(mockGoogleService.executeQuery).toHaveBeenCalledWith(
        syncRequest.customerId,
        syncRequest.refreshToken,
        mockQuery,
        syncRequest.loginCustomerId
      );
    });

    it('should throw InternalServerErrorException on error', async () => {
      mockGoogleService.executeQuery.mockRejectedValue(new Error('fail'));

      const syncRequest: SyncRequest = {
        userId: 1,
        customerId: '123',
        refreshToken: 'token',
        loginCustomerId: 'manager123',
      };

      await expect(service.performMetricSync(syncRequest)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });
});
