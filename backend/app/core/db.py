import logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from backend.app.core.config import settings

logger = logging.getLogger("sahayak_db")
logging.basicConfig(level=logging.INFO)

class HybridDatabase:
    def __init__(self):
        self.is_mock = True
        self.db = None
        self._in_memory_store = {
            "users": {},
            "schemes": {},
            "applications": {},
            "documents": {},
            "notifications": {},
            "admins": {},
            "chat_history": []
        }
        
        try:
            logger.info(f"Connecting to MongoDB at {settings.MONGODB_URI}")
            self.client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=2000)
            # Trigger server connection check
            self.client.admin.command('ping')
            self.db = self.client[settings.DATABASE_NAME]
            self.is_mock = False
            logger.info("Connected to MongoDB successfully!")
        except (ConnectionFailure, ServerSelectionTimeoutError, Exception) as e:
            logger.warning(f"MongoDB connection failed: {e}. Falling back to In-Memory storage.")
            self.is_mock = True
            
    def get_collection(self, name: str):
        if not self.is_mock and self.db is not None:
            return self.db[name]
        return InMemoryCollection(self._in_memory_store, name)

class InMemoryCollection:
    def __init__(self, store, name):
        self.store = store
        self.name = name
        
    def find_one(self, filter):
        items = self.find(filter)
        return items[0] if items else None
        
    def find(self, filter=None):
        filter = filter or {}
        results = []
        
        if self.name == "chat_history":
            # Chat history is a list
            data_list = self.store[self.name]
            for doc in data_list:
                match = True
                for k, v in filter.items():
                    if doc.get(k) != v:
                        match = False
                        break
                if match:
                    results.append(doc)
            return results
            
        data_dict = self.store[self.name]
        for key, doc in data_dict.items():
            match = True
            for k, v in filter.items():
                # Simple matching helper
                if k == "_id" and doc.get("_id") == v:
                    continue
                if doc.get(k) != v:
                    match = False
                    break
            if match:
                results.append(doc)
        return results

    def insert_one(self, document):
        if "_id" not in document:
            import uuid
            document["_id"] = str(uuid.uuid4())
        
        if self.name == "chat_history":
            self.store[self.name].append(document)
        else:
            self.store[self.name][document["_id"]] = document
        return InsertOneResult(document["_id"])

    def update_one(self, filter, update):
        # Update operator helper, expects e.g. {"$set": {...}}
        doc = self.find_one(filter)
        if not doc:
            return UpdateResult(0, 0)
            
        set_data = update.get("$set", {})
        for k, v in set_data.items():
            doc[k] = v
            
        if self.name != "chat_history":
            self.store[self.name][doc["_id"]] = doc
        return UpdateResult(1, 1)
        
    def delete_one(self, filter):
        doc = self.find_one(filter)
        if not doc:
            return DeleteResult(0)
        
        if self.name == "chat_history":
            self.store[self.name].remove(doc)
        else:
            del self.store[self.name][doc["_id"]]
        return DeleteResult(1)
        
    def count_documents(self, filter):
        return len(self.find(filter))

class InsertOneResult:
    def __init__(self, inserted_id):
        self.inserted_id = inserted_id

class UpdateResult:
    def __init__(self, matched_count, modified_count):
        self.matched_count = matched_count
        self.modified_count = modified_count

class DeleteResult:
    def __init__(self, deleted_count):
        self.deleted_count = deleted_count

# Global database instance
db_instance = HybridDatabase()

def get_db():
    return db_instance
