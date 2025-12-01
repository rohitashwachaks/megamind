"""
Script to create MongoDB indexes for optimal query performance.
Run this once after setting up the database.
"""

import os
import sys
from dotenv import load_dotenv
from pymongo import MongoClient, ASCENDING, DESCENDING

# Load environment variables
load_dotenv()

def create_indexes():
    """Create indexes on MongoDB collections for better performance."""
    
    # Connect to MongoDB
    uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    db_name = os.getenv("MONGO_DB_NAME", "megamind")
    
    print(f"Connecting to MongoDB at {uri}...")
    client = MongoClient(uri)
    db = client[db_name]
    
    print("\nCreating indexes...")
    
    # Users collection indexes
    print("  - users.id (unique)")
    db.users.create_index([("id", ASCENDING)], unique=True)
    
    # Courses collection indexes
    print("  - courses.id (unique)")
    db.courses.create_index([("id", ASCENDING)], unique=True)
    
    print("  - courses.status")
    db.courses.create_index([("status", ASCENDING)])
    
    print("  - courses.createdAt")
    db.courses.create_index([("createdAt", DESCENDING)])
    
    print("  - courses.updatedAt")
    db.courses.create_index([("updatedAt", DESCENDING)])
    
    # Compound index for filtering active courses by creation date
    print("  - courses.status + createdAt (compound)")
    db.courses.create_index([("status", ASCENDING), ("createdAt", DESCENDING)])
    
    # Index for searching courses by tags
    print("  - courses.tags")
    db.courses.create_index([("tags", ASCENDING)])
    
    # Embedded document indexes for lectures within courses
    print("  - courses.lectures.id")
    db.courses.create_index([("lectures.id", ASCENDING)])
    
    print("  - courses.lectures.status")
    db.courses.create_index([("lectures.status", ASCENDING)])
    
    print("  - courses.lectures.order")
    db.courses.create_index([("lectures.order", ASCENDING)])
    
    # Embedded document indexes for assignments within courses
    print("  - courses.assignments.id")
    db.courses.create_index([("assignments.id", ASCENDING)])
    
    print("  - courses.assignments.status")
    db.courses.create_index([("assignments.status", ASCENDING)])
    
    print("  - courses.assignments.dueDate")
    db.courses.create_index([("assignments.dueDate", ASCENDING)])
    
    print("\n✅ All indexes created successfully!")
    
    # List all indexes
    print("\nCurrent indexes on 'users' collection:")
    for index in db.users.list_indexes():
        print(f"  - {index['name']}: {index.get('key', {})}")
    
    print("\nCurrent indexes on 'courses' collection:")
    for index in db.courses.list_indexes():
        print(f"  - {index['name']}: {index.get('key', {})}")
    
    client.close()
    print("\nDatabase connection closed.")

if __name__ == "__main__":
    try:
        create_indexes()
    except Exception as e:
        print(f"\n❌ Error creating indexes: {e}")
        sys.exit(1)
