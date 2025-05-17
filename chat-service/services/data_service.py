import requests

class DataService:
    url = "http://localhost:3000/google/request"
    params = {
        "customerId": "9059845250",
        "loginCustomerId": "2898332235",
        "refreshToken": "1//05wmtbwQ2oiNKCgYIARAAGAUSNwF-L9IrsaDML5ZQHn9CR4pGnpkcXAlbrXNrEeakdMQKF9gFf4EhiAAd_vx93VR1X4lLhOUOLh0",
    }

    def __init__(self):
        pass

    def fetch_data(self, query):
        self.params["query"] = query
        response = requests.get(self.url, params=self.params)

        # Check the response
        print(response.status_code)
        print(response.url)         # This shows the full URL with params
        print(response.json())      # If the response is in JSON format
    
        return response.json()
    