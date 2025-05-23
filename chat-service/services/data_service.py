import requests

class DataService:
    url = "http://localhost:3000/google/request"

    ## TODO Remove Hardcoding
    params = {
        "customerId": "9059845250",
        "loginCustomerId": "2898332235",
        "refreshToken": "1//05wmtbwQ2oiNKCgYIARAAGAUSNwF-L9IrsaDML5ZQHn9CR4pGnpkcXAlbrXNrEeakdMQKF9gFf4EhiAAd_vx93VR1X4lLhOUOLh0",
    }

    def __init__(self):
        pass

    def send_sql_queries(self, queries, base_url="http://localhost:3000/data/request"):
        """
        Sends a list of SQL queries to the NestJS data endpoint via POST.

        Args:
            queries (list[str]): List of SQL query strings.
            base_url (str): Endpoint URL.

        Returns:
            list: List of responses from the server for each query.
        """
        try:
            response = requests.post(
                base_url,
                json={"queries": queries},
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            return None

    def post_usage(self, input_tokens, output_tokens, model, base_url="http://localhost:3000/usage"):
        usage_dto = {
            "userId": "2", # TODO REMOVE HARDCODING
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
            response.raise_for_status()
            print("Received USAGE response: " + str(response))
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            return None
