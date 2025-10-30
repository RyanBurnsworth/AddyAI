import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { GoogleService } from '../google/google.service';
import { DataService } from '../data/data.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('AccountService', () => {
  let service: AccountService;
  let mockGoogleService: Partial<GoogleService>;
  let mockDataService: Partial<DataService>;

  beforeEach(async () => {
    mockGoogleService = {
      getAccessibleAccounts: jest.fn(),
      isManager: jest.fn(),
      buildHierarchy: jest.fn(),
    };

    mockDataService = {
      findAccountByCustomerId: jest.fn(),
      createAccount: jest.fn(),
      findAccountsByUserId: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        { provide: GoogleService, useValue: mockGoogleService },
        { provide: DataService, useValue: mockDataService },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  describe('fetchAccounts', () => {
    it('should fetch and store accounts for non-manager users', async () => {
      (mockGoogleService.getAccessibleAccounts as jest.Mock).mockResolvedValue(['customers/123']);
      (mockGoogleService.isManager as jest.Mock).mockResolvedValue(false);
      (mockDataService.findAccountByCustomerId as jest.Mock).mockResolvedValue(null);

      const result = await service.fetchAccounts(1, 'refresh_token');

      expect(mockGoogleService.getAccessibleAccounts).toHaveBeenCalled();
      expect(mockGoogleService.isManager).toHaveBeenCalledWith('123', 'refresh_token');
      expect(mockDataService.createAccount).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it('should throw NotFoundException if accessible accounts fail', async () => {
      (mockGoogleService.getAccessibleAccounts as jest.Mock).mockRejectedValue(
        new Error('API error')
      );

      await expect(service.fetchAccounts(1, 'bad_token')).rejects.toThrow(NotFoundException);
    });

    it('should skip errors from individual account manager checks', async () => {
      (mockGoogleService.getAccessibleAccounts as jest.Mock).mockResolvedValue(['customers/123']);
      (mockGoogleService.isManager as jest.Mock).mockRejectedValue(new Error('Fail'));

      const result = await service.fetchAccounts(1, 'refresh_token');
      expect(result).toEqual([]);
    });

    it('should store manager and their clients correctly', async () => {
      (mockGoogleService.getAccessibleAccounts as jest.Mock).mockResolvedValue(['customers/999']);
      (mockGoogleService.isManager as jest.Mock).mockResolvedValue(true);
      (mockGoogleService.buildHierarchy as jest.Mock).mockResolvedValue([
        {
          managerId: '999',
          name: 'Main Manager',
          clients: [{ customerId: '111', name: 'Client A' }],
        },
      ]);
      (mockDataService.findAccountByCustomerId as jest.Mock).mockResolvedValue(null);

      const result = await service.fetchAccounts(10, 'refresh_token');

      expect(mockGoogleService.buildHierarchy).toHaveBeenCalled();
      expect(mockDataService.createAccount).toHaveBeenCalledTimes(2); // 1 manager + 1 client
      expect(result).toEqual([]); // still mocked to return []
    });

    it('should handle error creating an account and throw InternalServerErrorException', async () => {
      (mockGoogleService.getAccessibleAccounts as jest.Mock).mockResolvedValue(['customers/123']);
      (mockGoogleService.isManager as jest.Mock).mockResolvedValue(false);
      (mockDataService.findAccountByCustomerId as jest.Mock).mockResolvedValue(null);
      (mockDataService.createAccount as jest.Mock).mockRejectedValue(new Error('DB write failed'));

      await expect(service.fetchAccounts(1, 'refresh_token')).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });
});
