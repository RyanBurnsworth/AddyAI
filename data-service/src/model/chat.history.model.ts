// used for passing chat history to the LLM for memory
export interface ChatHistory {
  user_message: string;

  assistant_message: string;
}
