from datetime import datetime

from bson import ObjectId
from utils.utils import serialize_objectid, transform_query_dates, strip_unicode  # adjust import path as needed


# ----------------------------
# Tests for transform_query_dates
# ----------------------------

def test_transform_query_dates_success():
    input_query = {
        "query": {
            "start_date": {"$lte": "2023-01-01"},
            "end_date": {"$gte": "2023-01-31"}
        }
    }

    result = transform_query_dates(input_query.copy())

    assert isinstance(result["query"]["start_date"]["$lte"], datetime)
    assert isinstance(result["query"]["end_date"]["$gte"], datetime)
    assert result["query"]["start_date"]["$lte"] == datetime(2023, 1, 1)
    assert result["query"]["end_date"]["$gte"] == datetime(2023, 1, 31)


def test_transform_query_dates_missing_dates():
    input_query = {"query": {"start_date": {"$lte": "2023-01-01"}}}  # missing end_date
    result = transform_query_dates(input_query.copy())
    assert result == input_query  # should return unchanged


def test_transform_query_dates_invalid_format():
    input_query = {
        "query": {
            "start_date": {"$lte": "invalid-date"},
            "end_date": {"$gte": "2023-01-31"}
        }
    }

    result = transform_query_dates(input_query.copy())
    assert result == input_query  # should return unchanged due to exception


def test_transform_query_dates_empty_input():
    assert transform_query_dates({}) == {}


# ----------------------------
# Tests for strip_unicode
# ----------------------------

def test_strip_unicode_basic():
    text = "Café"
    result = strip_unicode(text)
    assert result == "Caf"


def test_strip_unicode_with_symbols():
    text = "✨🌟★"
    assert strip_unicode(text) == ""


def test_strip_unicode_no_unicode():
    text = "Just ASCII text 123"
    assert strip_unicode(text) == text

# -----------------------------
# Tests for serialize_objectid
# -----------------------------

def test_serialize_objectid():
    obj_id = ObjectId()
    test_data = {
        "_id": obj_id,
        "name": "Alice",
        "tags": ["user", ObjectId()],
        "metadata": {
            "created_by": ObjectId(),
            "notes": "some notes"
        }
    }

    result = serialize_objectid(test_data)

    # Ensure all ObjectIds have been converted to strings
    assert isinstance(result["_id"], str)
    assert result["_id"] == str(obj_id)

    assert isinstance(result["tags"][1], str)
    assert result["tags"][1] == str(test_data["tags"][1])

    assert isinstance(result["metadata"]["created_by"], str)
    assert result["metadata"]["created_by"] == str(test_data["metadata"]["created_by"])

    # Ensure non-ObjectId values remain unchanged
    assert result["name"] == "Alice"
    assert result["metadata"]["notes"] == "some notes"