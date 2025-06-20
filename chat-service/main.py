from http.client import HTTPException
from flask_cors import CORS
from services.data_service import DataService
from services.model_service import ModelService
from flask import Flask, abort, json, jsonify, request
from utils.constants import APPLICATION_JSON, CUSTOMER_ID, ERROR, GET, RECORDS, REQUEST_ANALYSIS, REQUEST_PSQL_ENDPOINT, STATUS, STATUS_INTERNAL_ERROR, STATUS_BAD_REQUEST, STATUS_FORBIDDEN, QUERY_GENERATOR_SYSTEM_PROMPT, REASONING_SYSTEM_PROMPT, LLM_GUARDRAIL_RESPONSE, USER_ID, USER_PROMPT
from typing import List, Dict, Optional

app = Flask(__name__)
CORS(app)

dataService = DataService()
modelService = ModelService(data_service=dataService)

"""
    Endpoint for generating the PSQL queries
    
    @returns an array of PSQL queries
"""
@app.route(REQUEST_PSQL_ENDPOINT, methods=[GET])
def fetch_psql_queries():
    user_prompt = request.args.get(USER_PROMPT)
    user_id = request.args.get(USER_ID)
    customer_id = request.args.get(CUSTOMER_ID)
    
    # Optional conversation history parameter
    conversation_history_param = request.args.get('conversation_history')
    conversation_history = None
    if conversation_history_param:
        try:
            conversation_history = json.loads(conversation_history_param)
        except json.JSONDecodeError:
            abort(STATUS_BAD_REQUEST, description="Invalid conversation_history format")
    
    # if the user_prompt not present in the body then return 400
    if user_prompt is None or user_prompt == "":
        abort(STATUS_BAD_REQUEST, description="Missing required field: user_prompt")

    try:
        # allow the LLM to generate the Postgres query by deriving from the user's prompt
        psql_queries = _generate_psql_query_from_LLM(user_id, customer_id, user_prompt, conversation_history)

        psql_queries = json.loads(psql_queries)

        if psql_queries == LLM_GUARDRAIL_RESPONSE:
            abort(STATUS_FORBIDDEN, description=LLM_GUARDRAIL_RESPONSE)
    except Exception as e:
        print("Error generating PSQL query: ", str(e))
        abort(STATUS_INTERNAL_ERROR, description="Error getting a response from the LLM: " + str(e))

    return psql_queries["queries"]

"""
    Endpoint for analyzing and responding to prompt
    Analyzes the user prompt with the necessary records

    @returns the analysis output
"""
@app.route(REQUEST_ANALYSIS, methods=["POST"])
def fetch_analysis():
    data = request.get_json()

    user_id = data.get(USER_ID)
    user_prompt = data.get(USER_PROMPT)
    records = data.get(RECORDS)
    conversation_history = data.get('conversation_history')  # Optional conversation history

    if not user_id or not user_prompt:
        abort(STATUS_BAD_REQUEST, description="Missing required fields: user_id or user_prompt")

    try:
        analysis = _get_reasoning_response(user_id, records, user_prompt, conversation_history)
    except Exception as e:
        print("Error generating analysis:", str(e))
        abort(STATUS_INTERNAL_ERROR, description="Failed to generate analysis")

    return jsonify(analysis)

# Use an LLM to derive a PSQL query from the user input
def _generate_psql_query_from_LLM(user_id: str, customer_id: str, user_prompt: str, conversation_history: Optional[List[Dict]] = None):
    try:
        return modelService.get_llm_response(
            QUERY_GENERATOR_SYSTEM_PROMPT, 
            user_id, 
            customer_id, 
            user_prompt, 
            conversation_history
        )
    except Exception as e:
        raise e

# Use a reasoning LLM to craft a response based on the results from Postgres and the user prompt
def _get_reasoning_response(user_id: str, query_results, user_prompt: str, conversation_history: Optional[List[Dict]] = None):
    try:
        enhanced_prompt = f"query results: {str(query_results)} User prompt: {str(user_prompt)}"
        llm_response = modelService.get_reasoning_response(
            user_id, 
            REASONING_SYSTEM_PROMPT, 
            enhanced_prompt, 
            conversation_history
        )
        return llm_response
    except Exception as e:
        raise e

@app.errorhandler(HTTPException)
def handle_exception(e):
    response = e.get_response()
    response.data = jsonify({
        ERROR: e.description,
        STATUS: e.code
    }).data
    response.content_type = APPLICATION_JSON
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)