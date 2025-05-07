from openai import OpenAI
from utils.constants import GPT_MODEL, SYSTEM, USER, O4_MINI

class ModelService:
    client = OpenAI()

    _previous_response_id: str = None

    def __init__(self):
        pass

    """
        Send a user request to the GPT 4.1 LLM
        @param request  The user request
        @returns response from the the GPT 4.1 LLM
    """
    def get_llm_response(self, system_prompt, user_prompt) -> str:
        try:
            response = self.client.responses.create(
                model=GPT_MODEL,
                input=[
                    {
                        "role": SYSTEM,
                        "content": system_prompt
                    },
                    {
                        "role": USER,
                        "content": user_prompt
                    }
                ]
            )
            return response.output_text
        except Exception as e:
            print("Unexpected error:", e)
            raise Exception

    """
        Send a user request that may require reasoning to the o4-mini LLM

        @param request  The user request
        @returns response from o4-mini
    """
    def get_reasoning_response(self, system_prompt, user_prompt) -> str:
        try:
            response = self.client.responses.create(
                model=O4_MINI,
                reasoning={"effort": "medium"},
                previous_response_id=self._previous_response_id,
                input=[
                    {
                        "role": SYSTEM,
                        "content": system_prompt
                    },
                    {
                        "role": USER,
                        "content": user_prompt
                    }
                ]
            )
            self._previous_response_id = response.id
            return response.output_text
        except Exception as e:
            print("Unexpected error:", e)
            raise Exception
