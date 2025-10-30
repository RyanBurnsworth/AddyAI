import { Test, TestingModule } from '@nestjs/testing';
import { DataController } from './data.controller';
import { DataService } from '../../service/data/data.service';
import { BadRequestException } from '@nestjs/common';
import { QueryDTO } from '../../dto/query.dto';

describe('DataController', () => {
  let controller: DataController;
  let mockDataService: Partial<DataService>;

  beforeEach(async () => {
    mockDataService = {
      executeQuery: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataController],
      providers: [{ provide: DataService, useValue: mockDataService }],
    }).compile();

    controller = module.get<DataController>(DataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('executeMultipleQueries', () => {
    it('should execute all queries and return results', async () => {
      // Arrange
      const mockResults = ['result1', 'result2'];
      (mockDataService.executeQuery as jest.Mock).mockImplementation(q =>
        Promise.resolve(`result${q}`)
      );

      const dto: QueryDTO = {
        queries: ['1', '2'],
      };

      // Act
      const result = await controller.executeMultipleQueries(dto);

      // Assert
      expect(mockDataService.executeQuery).toHaveBeenCalledTimes(2);
      expect(result).toEqual(['result1', 'result2']);
    });

    it('should throw BadRequestException if any query fails', async () => {
      (mockDataService.executeQuery as jest.Mock)
        .mockResolvedValueOnce('success')
        .mockRejectedValueOnce(new Error('fail'));

      const dto: QueryDTO = {
        queries: ['good', 'bad'],
      };

      // Act
      const result = await controller.executeMultipleQueries(dto);

      // Assert (error is caught and returned as BadRequestException)
      expect(result).toBeInstanceOf(BadRequestException);
      expect((result as BadRequestException).message).toBe('Error executing one or more queries');
    });

    it('should log the input DTO', async () => {
      console.log = jest.fn(); // mock console.log

      (mockDataService.executeQuery as jest.Mock).mockResolvedValue('OK');

      const dto: QueryDTO = {
        queries: ['query1'],
      };

      await controller.executeMultipleQueries(dto);
      expect(console.log).toHaveBeenCalledWith('QueryDTO Body: ', dto);
    });
  });
});
