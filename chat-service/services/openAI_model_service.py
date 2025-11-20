from openai import OpenAI
from services.data_service import DataService
from utils import utils
from utils.constants import GPT_MODEL, SYSTEM, USER, ASSISTANT, O4_MINI, ROLE, CONTENT
from datetime import date
from typing import List, Dict, Optional

class OpenAIModelService:
    client = OpenAI()
    
    _data_service: DataService

    _previous_response_id: str = None

    def __init__(self, data_service):
        self._data_service = data_service

    def _build_conversation_history(self, conversation_history: Optional[List[Dict]], system_prompt: str, user_prompt: str, user_id: str = None, customer_id: str = None) -> List[Dict]:
        """
        Build the full conversation history including system prompt, previous conversations, and current user prompt
        
        @param conversation_history: List of previous conversation turns (max 3)
        @param system_prompt: The system prompt
        @param user_prompt: Current user prompt
        @param user_id: User ID (for regular LLM calls)
        @param customer_id: Customer ID (for regular LLM calls)
        @returns: Full conversation history as list of message dictionaries
        """
        messages = []
        
        # Add system prompt
        messages.append({
            ROLE: SYSTEM,
            CONTENT: system_prompt
        })
        
        # Add previous conversation history (up to 3 previous exchanges)
        if conversation_history:
            # Limit to last 3 conversations and ensure they're properly formatted
            recent_history = conversation_history[-3:] if len(conversation_history) > 3 else conversation_history
            
            for turn in recent_history:
                # Add user message from history
                if 'user_message' in turn:
                    messages.append({
                        ROLE: USER,
                        CONTENT: turn['user_message']
                    })
                
                # Add assistant response from history
                if 'assistant_message' in turn:
                    messages.append({
                        ROLE: ASSISTANT,
                        CONTENT: turn['assistant_message']
                    })
        
        # Add current user prompt
        current_user_content = user_prompt
        if user_id and customer_id:
            current_user_content += f" userId = {user_id} customerId={customer_id} current date: {date.today()}"
        
        messages.append({
            ROLE: USER,
            CONTENT: current_user_content
        })
        
        return messages

    """
        Send a user request to the GPT 4.1 LLM with conversation history

        @param system_prompt        the prompt for the system to run off of
        @param user_prompt          the prompt from the user's input
        @param user_id              the user ID
        @param customer_id          the customer ID
        @param conversation_history optional list of previous conversations (max 3)
        @returns response from the GPT 4.1 LLM
    """
    def get_llm_response(self, system_prompt: str, user_id: str, customer_id: str, user_prompt: str, conversation_history: Optional[List[Dict]] = None) -> str:
        try:
            messages = self._build_conversation_history(
                conversation_history, 
                system_prompt, 
                user_prompt, 
                user_id, 
                customer_id
            )
            
            response = self.client.responses.create(
                model=GPT_MODEL,
                input=messages
            )
            
            # Send input_tokens, output_tokens and model to data service
            self._data_service.post_usage(user_id, response.usage.input_tokens, response.usage.output_tokens, GPT_MODEL)
            print(response.output_text)
            return response.output_text
        except Exception as e:
            print("Unexpected error:", e)
            raise Exception

    """
        Send a user request that may require reasoning to the o4-mini LLM with conversation history

        @param user_id              the user ID
        @param system_prompt        the prompt for the system to run off of
        @param user_prompt          the prompt from the user's input
        @param conversation_history optional list of previous conversations (max 3)
        @returns response from o4-mini
    """
    def get_reasoning_response(self, user_id: str, system_prompt: str, user_prompt: str, conversation_history: Optional[List[Dict]] = None) -> str:
        try:
            messages = self._build_conversation_history(
                conversation_history, 
                system_prompt, 
                user_prompt
            )
            
            response = self.client.responses.create(
                model=O4_MINI,
                reasoning={"effort": "medium"},
                previous_response_id=self._previous_response_id,
                input=messages
            )

            # update the data service with the tokens usage
            self._data_service.post_usage(user_id, response.usage.input_tokens, response.usage.output_tokens, O4_MINI)

            unicode_stripped = utils.strip_unicode(response.output_text)
            return unicode_stripped
        except Exception as e:
            print("Unexpected error:", e)
            raise Exception
