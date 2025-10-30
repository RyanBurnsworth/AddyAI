import { Test, TestingModule } from '@nestjs/testing';
import { ConversationController } from './conversation.controller';
import { ConversationService } from '../../service/conversation/conversation.service';
import { BadRequestException } from '@nestjs/common';
import { ConversationDTO } from 'src/dto/conversation.dto';
import { ExchangeDTO } from '../../dto/exchange.dto';

describe('ConversationController', () => {
  let controller: ConversationController;
  let service: jest.Mocked<ConversationService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversationController],
      providers: [
        {
          provide: ConversationService,
          useValue: {
            getConversation: jest.fn(),
            getGroupedConversationsInfo: jest.fn(),
            createConversation: jest.fn(),
            updateConversationExchange: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ConversationController>(ConversationController);
    service = module.get(ConversationService);
  });

  describe('getConversation', () => {
    it('should throw BadRequestException if user_id or customer_id is missing', async () => {
      await expect(controller.getConversation(undefined as any, '', 1)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should return a conversation if valid params are provided', async () => {
      const mockConversation = { id: 1 };
      service.getConversation.mockResolvedValueOnce(mockConversation);

      const result = await controller.getConversation(2, 'abc', 1);
      expect(result).toEqual(mockConversation);
      expect(service.getConversation).toHaveBeenCalledWith(1, 2, 'abc');
    });
  });

  describe('getGroupedConversationsInfo', () => {
    it('should throw BadRequestException if params are missing', async () => {
      await expect(controller.getGroupedConversationsInfo(undefined as any, '')).rejects.toThrow(
        BadRequestException
      );
    });

    it('should return grouped conversations info', async () => {
      const mockGrouped = [{ today: [] }];
      service.getGroupedConversationsInfo.mockResolvedValueOnce(mockGrouped);

      const result = await controller.getGroupedConversationsInfo(2, 'abc');
      expect(result).toEqual(mockGrouped);
      expect(service.getGroupedConversationsInfo).toHaveBeenCalledWith(2, 'abc');
    });
  });

  describe('createConversation', () => {
    it('should call service and return created conversation', async () => {
      const dto: ConversationDTO = {
        userId: 2,
        customerId: 'abc',
        exchanges: [],
      };

      const created = { id: 123, ...dto };
      service.createConversation.mockResolvedValueOnce(created);

      const result = await controller.createConversation(dto);
      expect(result).toEqual(created);
      expect(service.createConversation).toHaveBeenCalledWith(dto);
    });
  });

  describe('addConversation', () => {
    it('should call service and return updated conversation', async () => {
      const dto: ExchangeDTO = {
        conversationId: 1,
        input: 'hello',
        output: 'hi',
        completedAt: new Date().toISOString(),
      };

      const updated = { success: true };
      service.updateConversationExchange.mockResolvedValueOnce(updated);

      const result = await controller.addConversation(dto);
      expect(result).toEqual(updated);
      expect(service.updateConversationExchange).toHaveBeenCalledWith(dto);
    });
  });
});
