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
  
  static getMonthlyDateRangesUntil(targetDateString: string): { start: string; end: string }[] {
      const ranges = [];

      // Helper to format date to YYYY-MM-DD
      const format = (d: Date) => d.toISOString().split('T')[0];
      
      // Helper to strip time components (setting time to midnight in local timezone)
      const stripTime = (d: Date): Date => {
          return new Date(d.getFullYear(), d.getMonth(), d.getDate());
      };

      // 1. Prepare Target Date (Stripped of time for comparison)
      const rawTargetDate = new Date(targetDateString);
      const targetDateStripped = stripTime(rawTargetDate);
      
      // 2. Determine Yesterday (Stripped of time)
      const yesterday = stripTime(new Date());
      yesterday.setDate(yesterday.getDate() - 1); // Set to yesterday's date at midnight

      // 3. Initialize Loop Control
      // Start 'current' at the last day of yesterday's month. 
      // This is the month we process first.
      let currentMonthLastDay = new Date(yesterday.getFullYear(), yesterday.getMonth() + 1, 0); 
      
      // Ensure we don't start processing a month that is entirely in the future
      if (stripTime(currentMonthLastDay).getTime() > yesterday.getTime()) {
          currentMonthLastDay = yesterday;
      }


      // Loop backward month by month.
      // The condition checks if the 1st day of the current month being processed
      // is still less than or equal to the final end point (yesterday).
      while (new Date(currentMonthLastDay.getFullYear(), currentMonthLastDay.getMonth(), 1).getTime() <= yesterday.getTime()) {
          
          // Define the dates for the current month range
          let endOfRange = new Date(currentMonthLastDay);
          let startOfRange = new Date(currentMonthLastDay.getFullYear(), currentMonthLastDay.getMonth(), 1);

          // --- Adjustments ---

          // 1. Cap the END of the range: Must not go past yesterday.
          // This ensures the first range ends precisely yesterday.
          if (endOfRange.getTime() > yesterday.getTime()) {
              endOfRange = yesterday;
          }

          // 2. Cap the START of the range: Must not go before the target date.
          // This primarily affects the final (oldest) month being processed.
          if (startOfRange.getTime() < targetDateStripped.getTime()) {
              // If the 1st day of the month is before the target, 
              // set the start to the target date itself (stripped of time).
              startOfRange = targetDateStripped;
          }

          // 3. Validate and Store Range
          if (startOfRange.getTime() <= endOfRange.getTime()) {
              // We use unshift() to keep the ranges in chronological order (oldest first)
              ranges.unshift({ 
                  start: format(startOfRange), 
                  end: format(endOfRange) 
              });
          } else {
              // If the capped start is now after the capped end (e.g., target is today), stop processing.
              break; 
          }
          
          // --- Move to the PREVIOUS month
          // Set `currentMonthLastDay` to the last day of the month *before* the current one.
          // Setting the day to 0 moves the date object to the last day of the previous month.
          currentMonthLastDay.setDate(0); 

          // Final check to ensure we don't process months fully before the target date
          if (stripTime(currentMonthLastDay).getTime() < targetDateStripped.getTime()) {
                break;
          }
      }

      // The ranges were built oldest-to-newest using unshift, so we return them directly.
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
