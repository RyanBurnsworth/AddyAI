from http.client import HTTPException
from flask_cors import CORS
from services.data_service import DataService
from services.model_service import ModelService
from flask import Flask, abort, json, jsonify, request
from utils.constants import MESSAGE, POST, STATUS, STATUS_INTERNAL_ERROR, STATUS_BAD_REQUEST, STATUS_FORBIDDEN, REQUEST_ENDPOINT, ACCOUNT_ID_PARAM, QUERY_GENERATOR_SYSTEM_PROMPT, STATUS_NOT_FOUND, STATUS_OK, USER_PROMPT, REASONING_SYSTEM_PROMPT, LLM_GUARDRAIL_RESPONSE

app = Flask(__name__)
CORS(app)

dataService = DataService()
modelService = ModelService(data_service=dataService)

"""
    API endpoint for answering questions about their Google Ads data

    @returns the response from the AI
"""
@app.route(REQUEST_ENDPOINT, methods=[POST])
def user_request():
    body = request.get_json(silent=True)

    account_id = body.get(ACCOUNT_ID_PARAM)
    user_prompt = body.get(USER_PROMPT)

    # if the account_id is or user_prompt not present in the body then return 400
    if account_id is None:
        abort(STATUS_BAD_REQUEST, description="Missing required field: account id")
        return
    elif user_prompt is None:
        abort(STATUS_BAD_REQUEST, description="Missing required field: user_prompt")

    try:
        # allow the LLM to generate the Postgres query by deriving from the user's prompt
        psql_queries = _generate_psql_query_from_LLM(user_prompt)

        psql_queries = json.loads(psql_queries)
        print("QUERIES: ", psql_queries)
        print(type(psql_queries))

        if psql_queries == LLM_GUARDRAIL_RESPONSE:
            abort(STATUS_FORBIDDEN, description=LLM_GUARDRAIL_RESPONSE)
    except Exception as e:
        print("Error generating PSQL query: ", str(e))
        abort(STATUS_INTERNAL_ERROR, description="Error getting a response from the LLM: " + str(e))

    try:
        query_results = dataService.send_sql_queries(psql_queries["queries"])
        if not query_results:
            abort(STATUS_NOT_FOUND, description="Error finding data related to query: " + str(query_results))
    except Exception as e:
        print("Error executing Postgres query: ", str(e))
        abort(STATUS_INTERNAL_ERROR, description="Error processing Postgres query: " + str(e))

    try:
       llm_response = _get_reasoning_response(query_results, user_prompt)
    except Exception as e:
        print("Error get response from reasoning LLM: ", str(e))
        abort(STATUS_INTERNAL_ERROR, description="Error getting a response from the reasoning LLM: " + str(e))

    return jsonify({MESSAGE: llm_response, STATUS: STATUS_OK})


# Use an LLM to derive a PSQL query from the user input
def _generate_psql_query_from_LLM(user_prompt: str):
    try:
        print("")
        return modelService.get_llm_response(QUERY_GENERATOR_SYSTEM_PROMPT, user_prompt)
    except Exception as e:
        raise e

# Use a reasoning LLM to craft a response based on the results from Postgres and the user prompt
def _get_reasoning_response(query_results, user_prompt):
    try:
        llm_response = modelService.get_reasoning_response(REASONING_SYSTEM_PROMPT, "query results: " + str(query_results) + " User prompt: " + str(user_prompt))
        return llm_response
    except Exception as e:
        raise e

@app.errorhandler(HTTPException)
def handle_exception(e):
    response = e.get_response()
    response.data = jsonify({
        "error": e.description,
        "status": e.code
    }).data
    response.content_type = "application/json"
    return response

if __name__ == '__main__':
    app.run(debug=True)
