import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ConversationService } from '../../service/conversation/conversation.service';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @SkipThrottle()
  @Get('')
  async getConversation(
    @Query('user_id') userId: string,
    @Query('customer_id') customerId: string,
    @Query('conversation_id') conversationId: number
  ) {
    if (!userId || !customerId || customerId === '') {
      throw new BadRequestException('Missing required parameters: user_id and customer_id');
    }

    try {
      const conversation = await this.conversationService.getConversation(
        conversationId,
        userId,
        customerId
      );

      return conversation;
    } catch (error) {
      console.log('Failed to fetch conversations', error);
      throw error;
    }
  }

  @Get('grouped')
  async getGroupedConversationsInfo(
    @Query('user_id') userId: string,
    @Query('customer_id') customerId: string
  ) {
    if (!userId || !customerId || customerId === '') {
      throw new BadRequestException('Missing required parameters: user_id and customer_id');
    }

    try {
      const groupedConversationInfo = await this.conversationService.getGroupedConversationsInfo(
        userId,
        customerId
      );
      return groupedConversationInfo;
    } catch (error) {
      console.log('Failed to fetch conversations', error);
      throw error;
    }
  }
}
