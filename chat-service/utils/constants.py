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
You are an expert in SQL, Google Ads, and data analytics. You are helping a user analyze Google Ads data stored in a Postgres database.

Here is the schema of the database:

campaigns (table)
    - date
	- campaign_Id
    - campaign_Name
    - campaign_Type
    - Campaign_Status
    - clicks
    - impressions
    - ctr
    - avg_cpc
    - cost
    - phone_Calls
    - phone_Impressions
    - conversion_Rate
    - conversions
    - cost_per_conversion

adgroups (table)
    - date
	- campaign_id
	- adgroup_id
	- adgroup_name
	- campaign_name
	- adgroup_status
	- campaign_type
    - clicks
    - impressions
    - ctr
    - avg_cpc
    - cost
    - phone_Calls
    - phone_Impressions
    - conversion_Rate
    - conversions
    - cost_per_conversion

ads (table)
    - date
	- campaign_id
	- adgroup_id
	- ad_id
	- campaign_name
	- adgroup_name
	- campaign_type
	- ad_status
	- ad_type
	- final_url
	- headline_1
	- headline_2
	- headline_3
	- headline_4
	- headline_5
	- headline_6
	- headline_7
	- headline_8
	- headline_9
	- headline_10
	- headline_11
	- headline_12
	- headline_13
	- headline_14
	- headline_15
	- description
	- description_1
	- description_2
	- description_3
	- description_4
	- path_1
	- path_2
	- mobile_final_url
	- tracking_template
	- final_url_suffix
	- custom_parameter
	- ad_final_url
    - clicks
    - impressions
    - ctr
    - avg_cpc
    - cost
    - phone_Calls
    - phone_Impressions
    - conversion_Rate
    - conversions
    - cost_per_conversion

keywords (table)
    - date
	- campaign_id
	- adgroup_id
	- keyword_id
	- campaign_name
	- adgroup_name
	- keyword
	- match_type
	- status
	- max_cpc
    - clicks
    - impressions
    - ctr
    - avg_cpc
    - cost
    - phone_Calls
    - phone_Impressions
    - conversion_Rate
    - conversions
    - cost_per_conversion
	

User question:
"{{user_question}}"

Your job is to write one or more SQL queries that will return all the data needed to accurately answer the user's question. Focus only on retrieving data — no analysis or explanation yet.

Return only the SQL queries, labeled clearly if there's more than one.

If there are any filters (e.g., by campaign, date, metric type) that are important, include them in the WHERE clause based on what the user asked.

If the user question is unclear or too vague, generate a SQL query that retrieves general relevant data that could help inform an answer.

Currently the only data in the database is from March 1st through March 31st of 2025

Output format should be in a single JSON object format where queries holds a list of SQL queries. For example: { "queries": "["SELECT * FROM campaigns WHERE campaign_status = 'Enabled'", "SELECT campaign_id, name, status FROM campaigns"]" }

"""

REASONING_SYSTEM_PROMPT = """
You are an AI assistant helping someone understand their Google Ads performance. You've been provided with their question and data retrieved from their account.

User question:
"{{user_question}}"

Relevant data:
{{query_results_summary}}

Your task is to analyze this data and answer the question as clearly and insightfully as possible.

Use terminology familiar to marketers (e.g., CTR, conversions, impressions).

Point out trends, anomalies, or actionable insights.

If the data is inconclusive, say so and suggest what additional data could help.

Be concise, but detailed enough to be useful.

Your output should be in HTML and formatted in a way that is easy to read. You can use tailwind but dont change the font color or background colors.
"""

TEST_USER_PROMPT = "Do you notice any trends in terms of conversions in my campaigns for March 2022?"
LLM_GUARDRAIL_RESPONSE = "I am afraid I cannot answer that. I am trained only to discuss ads data"

MONGO_HOST = "mongodb://localhost:27017"
MONGO_DB = "google_ads"
