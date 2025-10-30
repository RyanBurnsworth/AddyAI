import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataService } from '../data/data.service';
import { firstValueFrom } from 'rxjs';
import { HelperUtil } from '../../util/helper.util';

@Injectable()
export class LLMService {
  constructor(
    private readonly httpService: HttpService,
    private readonly dataService: DataService
  ) {}

  /**
   * Send user prompt to the LLM to generate PSQL queries
   *
   * @param userId the id of the user
   * @param customerId the id of the Google Ads customer account
   * @param userPrompt the user input prompt
   * @param conversationId the id of the conversation
   */
  async fetchQueriesFromLLM(
    userId: number,
    customerId: string,
    userPrompt: string,
    conversationId?: number
  ): Promise<string[]> {
    try {
      let chatHistory = null;

      if (conversationId) {
        const exchanges = await this.dataService.findLatestThreeExchanges(
          conversationId,
          userId,
          customerId
        );
        chatHistory = HelperUtil.buildChatHistory(exchanges);
      }

      const response = await firstValueFrom(
        this.httpService.get('http://python:5000/psql', {
          params: {
            user_id: userId,
            customer_id: customerId,
            user_prompt: userPrompt,
            conversation_history: chatHistory,
          },
        })
      );

      // needed to audit queries
      console.log('Response Queries: ', response.data);

      return response.data;
    } catch (error) {
      console.error('Error fetching queries from chat service: ', error);
      throw new InternalServerErrorException('Failed to fetch queries from service');
    }
  }

  /**
   * Get analyisis from the LLM using the database records and user prompt
   *
   * @param userId the id of the user
   * @param userPrompt the input from the user
   * @param customerId the id of the customer
   * @param conversationId the id of the conversation
   * @param queries the PSQL queries to execute on the db
   *
   * @returns the LLM analysis
   */
  async getAnalysis(
    userId: number,
    userPrompt: string,
    customerId: string,
    queries: string[],
    conversationId?: number
  ): Promise<string> {
    try {
      const results = await Promise.all(queries.map(query => this.dataService.executeQuery(query)));

      // needed to audit values
      console.log('Query Results: ', results);

      let chatHistory = null;

      if (conversationId) {
        const exchanges = await this.dataService.findLatestThreeExchanges(
          conversationId,
          userId,
          customerId
        );
        chatHistory = HelperUtil.buildChatHistory(exchanges);
      }

      const response = await firstValueFrom(
        this.httpService.post(`http://python:5000/analysis`, {
          user_id: userId,
          user_prompt: userPrompt,
          records: results,
          conversation_history: chatHistory,
        })
      );

      return response.data;
    } catch (error) {
      console.log('Error getting analysis from LLM: ', error);
      throw new InternalServerErrorException('Failed to get analysis from LLM');
    }
  }
}
