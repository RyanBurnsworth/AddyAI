import { Test, TestingModule } from '@nestjs/testing';
import { DataService } from './data.service';
import { DataSource } from 'typeorm';
import { User } from '../../entity/user.entity';
import { Usage } from '../../entity/usage.entity';
import { Account } from '../../entity/account.entity';

describe('DataService', () => {
  let service: DataService;
  let mockDataSource: Partial<DataSource>;

  const mockRepo = {
    createQueryBuilder: jest.fn(),
    getOne: jest.fn(),
    getMany: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    mockDataSource = {
      query: jest.fn(),
      getRepository: jest.fn().mockReturnValue(mockRepo),
      createQueryBuilder: jest.fn().mockReturnValue({
        insert: jest.fn().mockReturnThis(),
        into: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        orIgnore: jest.fn().mockReturnThis(),
        execute: jest.fn(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [DataService, { provide: DataSource, useValue: mockDataSource }],
    }).compile();

    service = module.get<DataService>(DataService);
  });

  describe('executeQuery', () => {
    it('should execute raw query successfully', async () => {
      const result = [{ id: 1 }];
      (mockDataSource.query as jest.Mock).mockResolvedValue(result);
      const res = await service.executeQuery('SELECT * FROM test');
      expect(res).toEqual(result);
    });

    it('should throw on query failure', async () => {
      (mockDataSource.query as jest.Mock).mockRejectedValue(new Error('fail'));
      await expect(service.executeQuery('bad')).rejects.toThrow('Error executing query');
    });
  });

  describe('genericSave', () => {
    it('should insert records into table', async () => {
      const executeMock = jest.fn();
      const qb = {
        insert: jest.fn().mockReturnThis(),
        into: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        orIgnore: jest.fn().mockReturnThis(),
        execute: executeMock,
      };
      (mockDataSource.createQueryBuilder as jest.Mock).mockReturnValue(qb);
      await service.genericSave([{ foo: 'bar' }], 'test_table');
      expect(executeMock).toHaveBeenCalled();
    });
  });

  describe('findUserByUserId', () => {
    it('should return user if found', async () => {
      const getOneMock = jest.fn().mockResolvedValue({ id: 1 });

      (mockDataSource.getRepository as jest.Mock).mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnThis(),
          getOne: getOneMock,
        }),
      });

      const user = await service.findUserByUserId(1);
      expect(user).toEqual({ id: 1 });
    });

    it('should return null if not found', async () => {
      const getOneMock = jest.fn().mockResolvedValue(null);

      (mockDataSource.getRepository as jest.Mock).mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnThis(),
          getOne: getOneMock,
        }),
      });

      const user = await service.findUserByUserId(1);
      expect(user).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should update if user already exists', async () => {
      service.findUserByEmail = jest.fn().mockResolvedValue({ id: 1 });
      service.updateUser = jest.fn();
      const mockSaved = { id: 1, email: 'test@test.com' };
      service.findUserByEmail = jest.fn().mockResolvedValue(mockSaved);
      const result = await service.createUser(mockSaved as User);
      expect(result).toEqual(mockSaved);
    });

    it('should create new user if not exists', async () => {
      service.findUserByEmail = jest.fn().mockResolvedValue(null);
      mockRepo.create = jest.fn().mockReturnValue({ email: 'new@test.com' });
      mockRepo.save = jest.fn().mockResolvedValue({ id: 2, email: 'new@test.com' });
      const result = await service.createUser({
        email: 'new@test.com',
      } as User);
      expect(result).toEqual({ id: 2, email: 'new@test.com' });
    });
  });

  describe('createUsage', () => {
    it('should save usage', async () => {
      mockRepo.save = jest.fn().mockResolvedValue({ inputTokens: 100 });
      const usage = await service.createUsage({ inputTokens: 100 } as Usage);
      expect(usage).toEqual({ inputTokens: 100 });
    });
  });

  describe('findUsageRecordsByUserId', () => {
    it('should return usage records', async () => {
      const getManyMock = jest.fn().mockResolvedValue([{ inputTokens: 100 }]);

      (mockDataSource.getRepository as jest.Mock).mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnThis(),
          getMany: getManyMock,
        }),
      });

      const result = await service.findUsageRecordsByUserId('123');
      expect(result).toEqual([{ inputTokens: 100 }]);
    });
  });

  describe('findAccountByCustomerId', () => {
    it('should return account', async () => {
      const getOneMock = jest.fn().mockResolvedValue({ customerId: 'abc' });

      (mockDataSource.getRepository as jest.Mock).mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnThis(),
          getOne: getOneMock,
        }),
      });

      const result = await service.findAccountByCustomerId('abc');
      expect(result).toEqual({ customerId: 'abc' });
    });
  });

  describe('findAccountsByUserId', () => {
    it('should return list of accounts', async () => {
      const getManyMock = jest.fn().mockResolvedValue([{ userId: 1 }]);

      (mockDataSource.getRepository as jest.Mock).mockReturnValue({
        createQueryBuilder: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnThis(),
          getMany: getManyMock,
        }),
      });

      const result = await service.findAccountsByUserId(1);
      expect(result).toEqual([{ userId: 1 }]);
    });
  });

  describe('createAccount', () => {
    it('should save account', async () => {
      mockRepo.save = jest.fn().mockResolvedValue({ customerId: 'abc' });
      const result = await service.createAccount({
        customerId: 'abc',
      } as Account);
      expect(result).toEqual({ customerId: 'abc' });
    });
  });
});
