import pytest
from pymongo.errors import PyMongoError
from services.mongo_service import MongoService  # adjust import path as needed


def test_mongo_service_init_success(mocker):
    mock_client = mocker.patch("services.mongo_service.MongoClient")  # adjust path
    mock_client.return_value.__getitem__.return_value = "mock_db"

    service = MongoService()

    assert service.db == "mock_db"
    mock_client.assert_called_once()


def test_mongo_service_init_failure(mocker):
    mocker.patch("services.mongo_service.MongoClient", side_effect=PyMongoError("Connection failed"))

    with pytest.raises(ConnectionError, match="Failed to connect to MongoDB: Connection failed"):
        MongoService()

def test_find_success(mocker):
    # Mocking the transformed query
    mock_transform = mocker.patch("services.mongo_service.utils.transform_query_dates")
    mock_transform.return_value = {"name": "Test"}

    # Mocking the serialization
    mock_serialize = mocker.patch("services.mongo_service.utils.serialize_objectid")
    mock_serialize.return_value = [{"_id": 1, "name": "Test"}]

    # Mocking MongoDB collection and client
    mock_collection = mocker.MagicMock()
    mock_collection.find.return_value = [{"_id": 1, "name": "Test"}]

    mock_db = mocker.MagicMock()
    mock_db.__getitem__.return_value = mock_collection

    mock_client = mocker.patch("services.mongo_service.MongoClient")
    mock_client.return_value.__getitem__.return_value = mock_db

    service = MongoService()
    results = service.find("test_collection", {"name": "Test"}, {"_id": 1})

    assert results == [{"_id": 1, "name": "Test"}]
    mock_transform.assert_called_once_with({"name": "Test"})
    mock_collection.find.assert_called_once_with({"name": "Test"}, {"_id": 1})
    mock_serialize.assert_called_once_with([{"_id": 1, "name": "Test"}])

def test_find_failure(mocker):
    # Skip transform because query fails at Mongo call
    mock_transform = mocker.patch("services.mongo_service.utils.transform_query_dates")
    mock_transform.return_value = {"key": "value"}

    # Mock collection that raises error
    mock_collection = mocker.MagicMock()
    mock_collection.find.side_effect = PyMongoError("Query failed")

    mock_db = mocker.MagicMock()
    mock_db.__getitem__.return_value = mock_collection

    mock_client = mocker.patch("services.mongo_service.MongoClient")
    mock_client.return_value.__getitem__.return_value = mock_db

    service = MongoService()

    with pytest.raises(RuntimeError, match="Mongo query failed: Query failed"):
        service.find("test_collection", {"key": "value"})
    
    mock_transform.assert_called_once_with({"key": "value"})
    mock_collection.find.assert_called_once()
