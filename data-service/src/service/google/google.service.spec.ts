import { Test, TestingModule } from '@nestjs/testing';
import { GoogleService } from './google.service';
import { InternalServerErrorException } from '@nestjs/common';
import { GoogleAdsApi } from 'google-ads-api';

jest.mock('google-ads-api');

describe('GoogleService', () => {
  let service: GoogleService;
  let mockQuery: jest.Mock;
  let mockCustomer: jest.Mock;
  let mockListAccessibleCustomers: jest.Mock;

  beforeEach(async () => {
    mockQuery = jest.fn();
    mockCustomer = jest.fn().mockReturnValue({ query: mockQuery });
    mockListAccessibleCustomers = jest.fn();

    (GoogleAdsApi as jest.Mock).mockImplementation(() => ({
      Customer: mockCustomer,
      listAccessibleCustomers: mockListAccessibleCustomers,
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleService],
    }).compile();

    service = module.get<GoogleService>(GoogleService);
  });

  describe('executeQuery', () => {
    it('should return query results', async () => {
      mockQuery.mockResolvedValue([{ foo: 'bar' }]);

      const result = await service.executeQuery('123', 'token', 'SELECT...');
      expect(result).toEqual([{ foo: 'bar' }]);
    });

    it('should throw error on query failure', async () => {
      mockQuery.mockRejectedValue(new Error('Query error'));
      await expect(service.executeQuery('123', 'token', 'bad')).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('getAccessibleAccounts', () => {
    it('should return accessible customer IDs', async () => {
      mockListAccessibleCustomers.mockResolvedValue({
        resource_names: ['customers/123', 'customers/456'],
      });

      const result = await service.getAccessibleAccounts('token');
      expect(result).toEqual(['customers/123', 'customers/456']);
    });

    it('should throw error on failure', async () => {
      mockListAccessibleCustomers.mockRejectedValue(new Error('fail'));
      await expect(service.getAccessibleAccounts('token')).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('isManager', () => {
    it('should return true if account is manager', async () => {
      jest.spyOn(service, 'executeQuery').mockResolvedValue([{ customer: { manager: true } }]);

      const result = await service.isManager('123', 'token');
      expect(result).toBe(true);
    });

    it('should throw if check fails', async () => {
      jest.spyOn(service, 'executeQuery').mockRejectedValue(new Error());
      await expect(service.isManager('123', 'token')).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('buildHierarchy', () => {
    it('should return hierarchy with clients and sub-managers', async () => {
      const queryMock = jest.spyOn(service, 'executeQuery').mockImplementation(async () => [
        {
          customer_client: {
            client_customer: 'customers/999',
            descriptive_name: 'Test Client',
            manager: false,
          },
        },
      ]);

      const result = await service.buildHierarchy('123', 'token');
      expect(result).toEqual([
        {
          managerId: '123',
          name: '',
          clients: [{ customerId: '999', name: 'Test Client' }],
        },
      ]);
      expect(queryMock).toHaveBeenCalled();
    });

    it('should handle nested managers', async () => {
      jest
        .spyOn(service, 'executeQuery')
        .mockImplementationOnce(async () => [
          {
            customer_client: {
              client_customer: 'customers/321',
              descriptive_name: 'Nested Manager',
              manager: true,
            },
          },
        ])
        .mockImplementationOnce(async () => [
          {
            customer_client: {
              client_customer: 'customers/888',
              descriptive_name: 'Nested Client',
              manager: false,
            },
          },
        ]);

      const result = await service.buildHierarchy('123', 'token');
      expect(result.length).toBe(2); // includes sub-manager + current manager
    });

    it('should throw if query fails', async () => {
      jest.spyOn(service, 'executeQuery').mockRejectedValue(new Error());
      await expect(service.buildHierarchy('123', 'token')).rejects.toThrow();
    });
  });
});
