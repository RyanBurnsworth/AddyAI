import requests

class DataService:
    
    def __init__(self):
        pass

    def post_usage(self, user_id, input_tokens, output_tokens, model, base_url="http://localhost:3000/usage"):
        usage_dto = {
            "userId": user_id,
            "inputTokens": input_tokens,
            "outputTokens": output_tokens,
            "model": model
        }

        try:
            response = requests.post(
                base_url,
                json=usage_dto,
                headers={"Content-Type": "application/json"}
            )
            print(response)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            return None
