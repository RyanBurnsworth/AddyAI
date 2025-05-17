from http.client import HTTPException
import json

from flask_cors import CORS
from services.model_service import ModelService
from flask import Flask, abort, jsonify, request
from utils.constants import POST, STATUS_OK, STATUS_INTERNAL_ERROR, STATUS_BAD_REQUEST, STATUS_FORBIDDEN, STATUS_NOT_FOUND, REQUEST_ENDPOINT, ACCOUNT_ID_PARAM, QUERY_GENERATOR_SYSTEM_PROMPT, USER_PROMPT, REASONING_SYSTEM_PROMPT, LLM_GUARDRAIL_RESPONSE, MESSAGE, STATUS, COLLECTION_NAME, QUERY, PROJECTION

app = Flask(__name__)
CORS(app)

modelService = ModelService()

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
        # allow the LLM to generate the MongoDB query by deriving from the user's prompt
        mongo_query = _generate_mongo_query_from_LLM(user_prompt)
        if mongo_query == LLM_GUARDRAIL_RESPONSE:
            abort(STATUS_FORBIDDEN, description=LLM_GUARDRAIL_RESPONSE)
    except Exception as e:
        print("Error generating Mongo query: ", str(e))
        abort(STATUS_INTERNAL_ERROR, description="Error getting a response from the LLM: " + str(e))

    try:
        # execute the query on the 
        json_query = json.loads(mongo_query)
        # mongo_results = _execute_mongo_query(json_query)
        # if not mongo_results:
        #     abort(STATUS_NOT_FOUND, description="Error finding data related to query: " + str(mongo_query))
    except Exception as e:
        print("Error executing Mongo query: ", str(e))
        abort(STATUS_INTERNAL_ERROR, description="Error processing MongoDB query: " + str(e))

    try:
        print("TODO")
       # llm_response = _get_reasoning_response(mongo_results, user_prompt, json_query[COLLECTION_NAME])
    except Exception as e:
        print("Error get response from reasoning LLM: ", str(e))
        abort(STATUS_INTERNAL_ERROR, description="Error getting a response from the reasoning LLM: " + str(e))

    # return jsonify({MESSAGE: llm_response, STATUS: STATUS_OK})


# Use an LLM to derive a mongo query from the user input
def _generate_mongo_query_from_LLM(user_prompt: str):
    try:
        return modelService.get_llm_response(QUERY_GENERATOR_SYSTEM_PROMPT, user_prompt)
    except Exception as e:
        raise e

# Execute a mongo query on the database
# def _execute_mongo_query(mongo_query):
#     try:
#         # mongo_results = mongoService.find(mongo_query)
#         return mongo_results
#     except Exception as e:
#         raise e

# Use a reasoning LLM to craft a response based on the results from MongoDB and the user prompt
def _get_reasoning_response(mongo_results, user_prompt, collection_type):
    try:
        llm_response = modelService.get_reasoning_response(REASONING_SYSTEM_PROMPT, "Mongo results: " + str(mongo_results) + " from " + collection_type + " User prompt: " + str(user_prompt))
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
