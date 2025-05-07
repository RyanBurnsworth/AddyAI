from datetime import datetime

from bson import ObjectId


# transform dates in queries from strings to datetime format
def transform_query_dates(query_input: dict):
    if not query_input or not query_input.get("query", {}).get("start_date") or not query_input.get("query", {}).get("end_date"):
        print("missing date stuff")
        return query_input

    try:
        # Extract string dates
        start_date_str = query_input["query"]["start_date"]["$lte"]
        end_date_str = query_input["query"]["end_date"]["$gte"]

        # Parse to datetime
        start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
        end_date = datetime.strptime(end_date_str, "%Y-%m-%d")

        # Update the query with datetime objects
        query_input["query"]["start_date"]["$lte"] = start_date
        query_input["query"]["end_date"]["$gte"] = end_date

    except Exception as e:
        print("Exception: ", e)
        return query_input  # return unchanged if something went wrong

    return query_input


# remove unicode from input text
def strip_unicode(text):
    return text.encode('ascii', errors='ignore').decode('ascii')


# Function to serialize ObjectId to string
def serialize_objectid(data):
    if isinstance(data, ObjectId):
        return str(data)
    elif isinstance(data, dict):
        return {key: serialize_objectid(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [serialize_objectid(item) for item in data]
    return data
