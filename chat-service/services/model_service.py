from openai import OpenAI
from utils import utils
from utils.constants import GPT_MODEL, SYSTEM, USER, O4_MINI, ROLE, CONTENT

class ModelService:
    client = OpenAI()

    _previous_response_id: str = None

    def __init__(self):
        pass

    """
        Send a user request to the GPT 4.1 LLM

        @param system_prompt    the prompt for the system to run off of
        @param user_prompt     the prompt from the user's input
        @returns response from the the GPT 4.1 LLM
    """
    def get_llm_response(self, system_prompt, user_prompt) -> str:
        try:
            response = self.client.responses.create(
                model=GPT_MODEL,
                input=[
                    {
                        ROLE: SYSTEM,
                        CONTENT: system_prompt
                    },
                    {
                        ROLE: USER,
                        CONTENT: user_prompt
                    }
                ]
            )
            return response.output_text
        except Exception as e:
            print("Unexpected error:", e)
            raise Exception

    """
        Send a user request that may require reasoning to the o4-mini LLM

        @param system_prompt    the prompt for the system to run off of
        @param user_prompt     the prompt from the user's input
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
                        ROLE: SYSTEM,
                        CONTENT: system_prompt
                    },
                    {
                        ROLE: USER,
                        CONTENT: user_prompt
                    }
                ]
            )
            self._previous_response_id = response.id

            unicode_stripped = utils.strip_unicode(response.output_text)
            return unicode_stripped
        except Exception as e:
            print("Unexpected error:", e)
            raise Exception
