import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataService } from '../data/data.service';
import { ConversationDTO } from '../../dto/conversation.dto';
import { Conversation, Exchange } from '../../entity/conversation.entity';
import { HelperUtil } from '../../util/helper.util';
import { GroupedConversationInfo } from '../../model/grouped.conversation.info';
import { ExchangeDTO } from '../../dto/exchange.dto';

@Injectable()
export class ConversationService {
  constructor(private readonly dataService: DataService) {}

  async getConversation(
    conversationId: number,
    userId: string,
    customerId: string
  ): Promise<ConversationDTO> {
    try {
      const conversation = await this.dataService.findConversationById(
        conversationId,
        userId,
        customerId
      );

      if (!conversation) {
        console.warn(
          `Conversation not found. id=${conversationId}, userId=${userId}, customerId=${customerId}`
        );
        throw new NotFoundException('No conversation was found');
      }

      return {
        id: conversationId,
        userId,
        customerId,
        exchange: conversation.exchange,
      };
    } catch (error) {
      console.error('Error fetching conversation:', { conversationId, userId, customerId, error });
      throw error;
    }
  }

  async getGroupedConversationsInfo(
    userId: string,
    customerId: string
  ): Promise<GroupedConversationInfo> {
    try {
      const conversations = await this.dataService.findConversationsByUserIdAndCustomerId(
        userId,
        customerId
      );

      if (!conversations?.length) {
        console.warn(`No conversations found. userId=${userId}, customerId=${customerId}`);
        throw new NotFoundException('No conversation was found');
      }

      const conversationInfoList = conversations.map(({ id, createdAt, exchange }) => ({
        id,
        createdAt,
        headline: exchange?.[0]?.input?.substring(0, 50) ?? '',
      }));

      const [grouped] = HelperUtil.groupConversationsInfoByDate(conversationInfoList);
      return grouped;
    } catch (error) {
      console.error('Error fetching grouped conversations:', { userId, customerId, error });
      throw error;
    }
  }

  async createConversation(conversationDto: ConversationDTO): Promise<Conversation> {
    const newConversation = {
      ...new Conversation(),
      createdAt: new Date(),
      customerId: conversationDto.customerId,
      userId: conversationDto.userId,
      exchange: conversationDto.exchange,
    };

    try {
      return await this.dataService.createConversation(newConversation);
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw new InternalServerErrorException('Failed to create conversation');
    }
  }

  async updateConversationExchange(exchangeDTO: ExchangeDTO): Promise<Conversation> {
    const { conversationId, userId, customerId, input, output } = exchangeDTO;

    if (!conversationId) {
      throw new BadRequestException('Missing parameter: conversationId');
    }

    try {
      const conversation = await this.dataService.findConversationById(
        conversationId,
        userId,
        customerId
      );

      if (!conversation) {
        console.warn(`Conversation not found for update. id=${conversationId}`);
        throw new NotFoundException("Failed to update. Conversation doesn't exist");
      }

      const newExchange = {
        ...new Exchange(),
        input,
        output,
        completedAt: new Date(),
      };

      conversation.exchange.push(newExchange);

      await this.dataService.updateConversation(conversation);
      return;
    } catch (error) {
      console.error('Error updating conversation:', error);
      throw new InternalServerErrorException('Error upserting conversation');
    }
  }
}
