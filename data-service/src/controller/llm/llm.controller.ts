import { Body, Controller, Post } from '@nestjs/common';
import { LLMRequestDTO } from '../../dto/llm.request.dto';
import { DataService } from '../../service/data/data.service';
import { LLMService } from '../../service/llm/llm.service';
import { Conversation, Exchange } from 'src/entity/conversation.entity';
import { Throttle } from '@nestjs/throttler';

@Throttle({ default: { limit: 5, ttl: 60000 } })
@Controller('llm')
export class LLMController {
  constructor(
    private readonly llmService: LLMService,
    private readonly dataService: DataService
  ) {}

  @Post('analysis')
  async getAnalysis(@Body() llmRequest: LLMRequestDTO) {
    try {
      const queries = await this.llmService.fetchQueriesFromLLM(
        llmRequest.userId,
        llmRequest.customerId,
        llmRequest.userPrompt,
        llmRequest.conversationId
      );

      const result = await this.llmService.getAnalysis(
        llmRequest.userId,
        llmRequest.userPrompt,
        llmRequest.customerId,
        queries,
        llmRequest.conversationId
      );

      // store the interaction in the conversation history
      if (!llmRequest.conversationId) {
        const newConversation = new Conversation();
        newConversation.createdAt = new Date();
        newConversation.customerId = llmRequest.customerId;
        newConversation.userId = llmRequest.userId;

        const exchange = new Exchange();
        exchange.completedAt = new Date();
        exchange.input = llmRequest.userPrompt;
        exchange.output = result;

        newConversation.exchange = [exchange];

        const conversation = await this.dataService.createConversation(newConversation);
        return { conversationId: conversation.id, result: result };
      } else {
        const existingConversation = await this.dataService.findConversationById(
          llmRequest.conversationId,
          llmRequest.userId,
          llmRequest.customerId
        );
        const exchange = new Exchange();
        exchange.completedAt = new Date();
        exchange.input = llmRequest.userPrompt;
        exchange.output = result;

        existingConversation.exchange.push(exchange);

        await this.dataService.updateConversation(existingConversation);

        return { conversationId: existingConversation.id, result: result };
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  }
}
