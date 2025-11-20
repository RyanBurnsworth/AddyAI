from datetime import date
from google import genai
from google.genai import types
from utils.constants import GEMINI_FLASH_25
from services.data_service import DataService

class GeminiModelService:
    _data_service: DataService

    def __init__(self, data_service: DataService):
        self.client = genai.Client()
        self._data_service = data_service
        self.chat = self.client.chats.create(model=GEMINI_FLASH_25)
    
    def get_llm_response(self, system_prompt: str, user_id: str, customer_id: str, user_prompt: str) -> str:
        print("GeminiModelService - get_llm_response called")
        user_prompt += f" userId = {user_id} customerId={customer_id} current date: {date.today()}"

        response = self.chat.send_message(
            message=user_prompt,
            config=types.GenerateContentConfig(system_instruction = system_prompt)
        )

        cleaned_response = response.text
        cleaned_response = cleaned_response.replace("```json", "")
        cleaned_response = cleaned_response.replace("```", "")

        print("Response from Gemini: ", cleaned_response)
        #self._data_service.post_usage(user_id, response.usage.input_tokens, response.usage.output_tokens, GEMINI_FLASH_25)
        return cleaned_response
    
    def get_reasoning_response(self, system_prompt: str, user_prompt: str):
        response = self.chat.send_message(
            message=user_prompt,
            config=types.GenerateContentConfig(system_instruction = system_prompt)
        )

        return response.text
