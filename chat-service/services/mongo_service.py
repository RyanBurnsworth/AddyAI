from pymongo import MongoClient
from pymongo.errors import PyMongoError
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
            collection = self.db[collection_name]
            return list(collection.find(query, projection))
        except PyMongoError as e:
            raise RuntimeError(f"Mongo query failed: {e}")
