from pymongo import MongoClient
from pymongo.errors import PyMongoError
from utils import utils
from utils.constants import MONGO_DB, MONGO_HOST

class MongoService:
    def __init__(self):
        try:
            self.client = MongoClient(MONGO_HOST)
            self.db = self.client[MONGO_DB]
        except PyMongoError as e:
            raise ConnectionError(f"Failed to connect to MongoDB: {e}")

    def find(self, collection_name: str, query: dict = {}, projection: dict = None):
        try:
            transformed_query = utils.transform_query_dates(query)

            collection = self.db[collection_name]
            results = list(collection.find(transformed_query, projection))
            
            # Serialize any ObjectId in the MongoDB response before returning it
            serialized_results = utils.serialize_objectid(results)
            return serialized_results
        except PyMongoError as e:
            raise RuntimeError(f"Mongo query failed: {e}")
