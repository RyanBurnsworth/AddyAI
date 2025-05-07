import json
from services.model_service import ModelService
from flask import Flask, abort, jsonify, request
from services.mongo_service import MongoService
from utils.constants import POST, STATUS_OK, STATUS_INTERNAL_ERROR, STATUS_BAD_REQUEST, STATUS_FORBIDDEN, STATUS_NOT_FOUND, REQUEST_ENDPOINT, ACCOUNT_ID_PARAM, QUERY_GENERATOR_SYSTEM_PROMPT, USER_PROMPT, REASONING_SYSTEM_PROMPT, LLM_GUARDRAIL_RESPONSE, MESSAGE, STATUS, COLLECTION_NAME, QUERY, PROJECTION

app = Flask(__name__)

modelService = ModelService()
mongoService = MongoService()

"""
    API endpoint for answering questions about their Google Ads data

    @returns the response from the AI
"""
@app.route(REQUEST_ENDPOINT, methods=[POST])
def user_request():
    body = request.get_json()

    account_id = body.get(ACCOUNT_ID_PARAM)
    user_prompt = body.get(USER_PROMPT)

    # if the account_id is or user_prompt not present in the body then return 400
    if account_id is None:
        abort(STATUS_BAD_REQUEST, description="Missing required field: account id")
        return
    elif user_prompt is None:
        abort(STATUS_BAD_REQUEST, description="Missing required field: user_prompt")

    mongo_query = _generate_mongo_query_from_LLM(user_prompt)
    if mongo_query == LLM_GUARDRAIL_RESPONSE:
        abort(STATUS_FORBIDDEN, description=LLM_GUARDRAIL_RESPONSE)

    json_query = json.loads(mongo_query)
    mongo_results = _execute_mongo_query(json_query)
    if not mongo_results:
        abort(STATUS_NOT_FOUND, description="Error finding data related to query: " + str(mongo_query))

    llm_response = _get_reasoning_response(mongo_results, user_prompt, json_query[COLLECTION_NAME])

    return jsonify({MESSAGE: llm_response, STATUS: STATUS_OK})


# Use an LLM to derive a mongo query from the user input
def _generate_mongo_query_from_LLM(user_prompt: str):
    try:
        return modelService.get_llm_response(QUERY_GENERATOR_SYSTEM_PROMPT, user_prompt)
    except Exception as e:
        abort(STATUS_INTERNAL_ERROR, description="Error getting a response from the LLM: " + str(e))


# Execute a mongo query on the database
def _execute_mongo_query(mongo_query):
    try:
        mongo_results = mongoService.find(mongo_query[COLLECTION_NAME], mongo_query[QUERY], mongo_query[PROJECTION])
        return mongo_results
    except Exception as e:
        abort(STATUS_INTERNAL_ERROR, description="Error processing MongoDB query: " + str(e))


# Use a reasoning LLM to craft a response based on the results from MongoDB and the user prompt
def _get_reasoning_response(mongo_results, user_prompt, collection_type):
    try:
        llm_response = modelService.get_reasoning_response(REASONING_SYSTEM_PROMPT, "Mongo results: " + str(mongo_results) + " from " + collection_type + " User prompt: " + str(user_prompt))
        return llm_response
    except Exception as e:
        abort(STATUS_INTERNAL_ERROR, description="Error getting a response from the reasoning LLM: " + str(e))


# Custom error response for 400 errors
@app.errorhandler(STATUS_BAD_REQUEST)
def handle_400_error(error):
    return jsonify({MESSAGE: error.description, STATUS: STATUS_BAD_REQUEST})


# Custom error response for 403 errors
@app.errorhandler(STATUS_FORBIDDEN)
def handle_403_error(error):
    return jsonify({MESSAGE: error.description, STATUS: STATUS_BAD_REQUEST})


# Custom error response for 404 errors
@app.errorhandler(STATUS_NOT_FOUND)
def handle_404_error(error):
    return jsonify({MESSAGE: error.description, STATUS: STATUS_NOT_FOUND})


# Custom error response for 500 errors
@app.errorhandler(STATUS_INTERNAL_ERROR)
def handle_500_error(error):
    return jsonify({MESSAGE: error.description, STATUS: STATUS_INTERNAL_ERROR})


if __name__ == '__main__':
    app.run(debug=True)
