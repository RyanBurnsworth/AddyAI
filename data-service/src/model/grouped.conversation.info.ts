export class ConversationInfo {
  id: number;

  headline: string; // first input in a conversation's exchance

  createdAt: Date;
}

export class GroupedConversationInfo {
  today: ConversationInfo[];

  yesterday: ConversationInfo[];

  last_7_days: ConversationInfo[];

  last_30_day: ConversationInfo[];

  previous: ConversationInfo[];
}
