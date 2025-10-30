import { Test, TestingModule } from '@nestjs/testing';
import { SyncController } from './sync.controller';
import { SyncService } from '../../service/sync/sync.service';
import { SyncRequest } from '../../model/sync.request.model';

describe('SyncController', () => {
  let controller: SyncController;
  let mockSyncService: Partial<Record<keyof SyncService, jest.Mock>>;

  beforeEach(async () => {
    mockSyncService = {
      performMetricSync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SyncController],
      providers: [{ provide: SyncService, useValue: mockSyncService }],
    }).compile();

    controller = module.get<SyncController>(SyncController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sync', () => {
    it('should call performMetricSync and return the result', async () => {
      const mockRequest: SyncRequest = {
        customerId: '1234567890',
        userId: 2,
        refreshToken: 'refresh_token_here',
        loginCustomerId: '9999999999',
      };

      const expectedResponse = { success: true };
      mockSyncService.performMetricSync.mockResolvedValue(expectedResponse);

      const result = await controller.sync(mockRequest);
      expect(mockSyncService.performMetricSync).toHaveBeenCalledWith(mockRequest);
      expect(result).toEqual(expectedResponse);
    });

    it('should propagate errors from performMetricSync', async () => {
      const mockRequest: SyncRequest = {
        customerId: '1234567890',
        userId: 2,
        refreshToken: 'refresh_token_here',
        loginCustomerId: '9999999999',
      };

      const error = new Error('Sync failed');
      mockSyncService.performMetricSync.mockRejectedValue(error);

      await expect(controller.sync(mockRequest)).rejects.toThrow('Sync failed');
    });
  });
});
