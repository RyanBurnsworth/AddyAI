import { Exchange } from 'src/entity/conversation.entity';
import { ConversationInfo, GroupedConversationInfo } from '../model/grouped.conversation.info';
import { ChatHistory } from 'src/model/chat.history.model';

export class HelperUtil {
  static getMonthlyDateRanges(): { start: string; end: string }[] {
    const ranges = [];
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    for (let i = 5; i >= 0; i--) {
      const start = new Date(yesterday.getFullYear(), yesterday.getMonth() - i, 1);
      let end: Date;

      if (i === 0) {
        end = new Date(yesterday); // yesterday for the most recent range
      } else {
        end = new Date(start.getFullYear(), start.getMonth() + 1, 0); // end of the month
      }

      const format = (d: Date) => d.toISOString().split('T')[0];
      ranges.push({ start: format(start), end: format(end) });
    }
    return ranges;
  }

  static createMetricsQuery(startDate: string, endDate: string, query: string): string {
    return query + " WHERE segments.date BETWEEN '" + startDate + "' AND '" + endDate + "'";
  }

  static groupConversationsInfoByDate(
    conversionInfoList: ConversationInfo[]
  ): GroupedConversationInfo[] {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    const startOf7DaysAgo = new Date(startOfToday);
    startOf7DaysAgo.setDate(startOf7DaysAgo.getDate() - 6); // includes today

    const startOf30DaysAgo = new Date(startOfToday);
    startOf30DaysAgo.setDate(startOf30DaysAgo.getDate() - 29); // includes today

    const result = {
      today: [] as ConversationInfo[],
      yesterday: [] as ConversationInfo[],
      last_7_days: [] as ConversationInfo[],
      last_30_day: [] as ConversationInfo[],
      previous: [] as ConversationInfo[],
    };

    for (const convo of conversionInfoList) {
      const created = new Date(convo.createdAt);

      if (created >= startOfToday) {
        result.today.push(convo);
      } else if (created >= startOfYesterday && created < startOfToday) {
        result.yesterday.push(convo);
      } else if (created >= startOf7DaysAgo) {
        result.last_7_days.push(convo);
      } else if (created >= startOf30DaysAgo) {
        result.last_30_day.push(convo);
      } else {
        result.previous.push(convo);
      }
    }

    return [result] as GroupedConversationInfo[];
  }

  static buildChatHistory(exchanges: Exchange[]): ChatHistory[] {
    const chatHistory: ChatHistory[] = [];
    exchanges.forEach(exchange => {
      const chat: ChatHistory = {
        user_message: exchange.input,
        assistant_message: exchange.output,
      };

      chatHistory.push(chat);
    });

    return chatHistory;
  }
}
