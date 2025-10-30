import { Test, TestingModule } from '@nestjs/testing';
import { UsageController } from './usage.controller';
import { UsageService } from '../../service/usage/usage.service';
import { UsageDTO } from '../../dto/usage.dto';
import { Response } from 'express';

describe('UsageController', () => {
  let controller: UsageController;
  let usageService: Partial<Record<keyof UsageService, jest.Mock>>;

  const mockResponse = () => {
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    return res as Response;
  };

  beforeEach(async () => {
    usageService = {
      insertTokens: jest.fn(),
      getTokenUsageByUserId: jest.fn(),
      aggregateDailyTotals: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsageController],
      providers: [{ provide: UsageService, useValue: usageService }],
    }).compile();

    controller = module.get<UsageController>(UsageController);
  });

  describe('POST /usage', () => {
    it('should return 201 on success', async () => {
      const res = mockResponse();
      const dto: UsageDTO = {
        userId: 1,
        model: 'gpt-4',
        inputTokens: 100,
        outputTokens: 200,
      };

      await controller.saveUsageRecord(res, dto);

      expect(usageService.insertTokens).toHaveBeenCalledWith(dto);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return 500 and error message on failure', async () => {
      const res = mockResponse();
      const dto: UsageDTO = {
        userId: 1,
        model: 'gpt-4',
        inputTokens: 100,
        outputTokens: 200,
      };

      usageService.insertTokens.mockRejectedValue(new Error('DB error'));

      await controller.saveUsageRecord(res, dto);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith('Error saving usage records');
    });
  });

  describe('GET /usage', () => {
    it('should return usage data and 200 status', async () => {
      const res = mockResponse();
      const usageData = [{ userId: '1', inputTokens: 100 }];
      usageService.getTokenUsageByUserId.mockReturnValue(usageData);

      await controller.getUsage(res, '1');

      expect(usageService.getTokenUsageByUserId).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(usageData);
    });

    it('should return 500 and error message on failure', async () => {
      const res = mockResponse();
      usageService.getTokenUsageByUserId.mockImplementation(() => {
        throw new Error('fetch failed');
      });

      await controller.getUsage(res, '1');

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith('Error fetching usage for user');
    });
  });

  describe('GET /usage/aggregate', () => {
    it('should return aggregated usage and 200 status', async () => {
      const res = mockResponse();
      const usageData = [{ userId: '1', inputTokens: 100 }];
      const aggregated = [{ date: '2024-01-01', inputTokens: 100 }];

      usageService.getTokenUsageByUserId.mockResolvedValue(usageData);
      usageService.aggregateDailyTotals.mockResolvedValue(aggregated);

      await controller.getUsageByDay(res, '1');

      expect(usageService.getTokenUsageByUserId).toHaveBeenCalledWith('1');
      expect(usageService.aggregateDailyTotals).toHaveBeenCalledWith(usageData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(aggregated);
    });

    it('should throw InternalServerErrorException on failure', async () => {
      const res = mockResponse();
      usageService.getTokenUsageByUserId.mockRejectedValue(new Error('fail'));

      await expect(controller.getUsageByDay(res, '1')).rejects.toThrow(
        'Error getting usage by day for user'
      );
    });
  });
});
