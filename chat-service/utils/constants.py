POST = "POST"

STATUS_OK = 200
STATUS_BAD_REQUEST = 400
STATUS_FORBIDDEN = 403
STATUS_NOT_FOUND = 404
STATUS_INTERNAL_ERROR = 500

GPT_MODEL = "gpt-4.1"
O4_MINI = "o4-mini"
SYSTEM = "developer"
USER = "user"

REQUEST_ENDPOINT = "/request"
ACCOUNT_ID_PARAM = "account_id"
USER_PROMPT = "user_prompt"

MESSAGE = "message"
STATUS = "status"

COLLECTION_NAME = "collection_name"
QUERY = "query"
PROJECTION = "projection"

ROLE = "role"
CONTENT = "content"

QUERY_GENERATOR_SYSTEM_PROMPT = """
You are an expert at MongoDB. You have access to a set of collections: Accounts, Campaigns, AdGroups, Ads, Keywords
 Accounts collection will have fields: accountId, cost, cost-per-click, conversions, cost-per-conversion, clicks, impressions, start_date, end_date 
 Campaigns collection will have fields: campaignId, campaignName, cost, cost-per-click, conversions, cost-per-conversion, clicks, impressions,  start_date, end_date 
 AdGroups collection will have fields: campaignId, campaignName, adGroupName, cost, cost-per-click, conversions, cost-per-conversion, clicks, impressions, start_date, end_date 
 Ads collection will have fields: campaignId, campaignName, adGroupName, AdId, headline1, headline 2, headline3, description1, description2, decription3, url, cost, cost-per-click, conversions, cost-per-conversion, clicks, impressions,  start_date, end_date
 Keywords collection will have fields: campaignId, campaignName, adGroupName, keywordText, cost, cost-per-click, conversions, cost-per-conversion, clicks, impressions, start_date, end_date

  Using the natural language input from the user you will derive a MongoDB query to that will satisfy retrieving the data needed to answer their question. 
 This data will be passed to a find function like this def find(self, collection_name: str, query: dict = {}, projection: dict = None). . 
 I need you to return a JSON object in this format: {"collection_name": "the name of the collection you want to query", "query": "the derived query in the correct format to be passed into the find function", "projection": "the projection for the query"}
 When responding only return the JSON object and nothing other. Do not wrap the output in ```json output ```

 If a user request is not related to their ads data respond with "I am afraid I cannot answer that. I am trained only to discuss ads data"
"""

REASONING_SYSTEM_PROMPT = """
You are a Google Ads expert. You will be provided with data from a user's Google Ads and their question or prompt. Use the data to fully answer their question. If you are unsure feel free to ask questions.

When references campaigns, ad groups, keywords or ads use the name rather than the id. For keywords use the keyword text and for ads use headline1.
Please return all output in HTML format.
"""
TEST_USER_PROMPT = "Do you notice any trends in terms of conversions in my campaigns for March 2022?"
LLM_GUARDRAIL_RESPONSE = "I am afraid I cannot answer that. I am trained only to discuss ads data"

MONGO_HOST = "mongodb://localhost:27017"
MONGO_DB = "google_ads"
