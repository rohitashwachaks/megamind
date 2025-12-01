"""
Script to create MongoDB indexes for optimal query performance.
Run this once after setting up the database.

This script creates indexes for the new schema with separated:
- Users (authentication data)
- Courses (public catalog data)
- UserCourseData (user-specific progress and notes)
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
    
    print("  - users.email (unique)")
    db.users.create_index([("email", ASCENDING)], unique=True)
    
    # Courses collection indexes (public catalog data)
    print("  - courses.id (unique)")
    db.courses.create_index([("id", ASCENDING)], unique=True)
    
    print("  - courses.createdAt")
    db.courses.create_index([("createdAt", DESCENDING)])
    
    print("  - courses.updatedAt")
    db.courses.create_index([("updatedAt", DESCENDING)])
    
    # Index for searching courses by tags
    print("  - courses.tags")
    db.courses.create_index([("tags", ASCENDING)])
    
    # Embedded document indexes for lectures within courses (catalog metadata)
    print("  - courses.lectures.id")
    db.courses.create_index([("lectures.id", ASCENDING)])
    
    print("  - courses.lectures.order")
    db.courses.create_index([("lectures.order", ASCENDING)])
    
    # Embedded document indexes for assignments within courses (catalog metadata)
    print("  - courses.assignments.id")
    db.courses.create_index([("assignments.id", ASCENDING)])
    
    # UserCourseData collection indexes (user-specific data)
    print("  - user_course_data.id (unique)")
    db.user_course_data.create_index([("id", ASCENDING)], unique=True)
    
    print("  - user_course_data.userId")
    db.user_course_data.create_index([("userId", ASCENDING)])
    
    print("  - user_course_data.courseId")
    db.user_course_data.create_index([("courseId", ASCENDING)])
    
    print("  - user_course_data.userId + courseId (compound, unique)")
    db.user_course_data.create_index([("userId", ASCENDING), ("courseId", ASCENDING)], unique=True)
    
    print("  - user_course_data.userId + status (compound)")
    db.user_course_data.create_index([("userId", ASCENDING), ("status", ASCENDING)])
    
    print("  - user_course_data.lectures.lectureId")
    db.user_course_data.create_index([("lectures.lectureId", ASCENDING)])
    
    print("  - user_course_data.assignments.assignmentId")
    db.user_course_data.create_index([("assignments.assignmentId", ASCENDING)])
    
    print("\n✅ All indexes created successfully!")
    
    # List all indexes
    print("\nCurrent indexes on 'users' collection:")
    for index in db.users.list_indexes():
        print(f"  - {index['name']}: {index.get('key', {})}")
    
    print("\nCurrent indexes on 'courses' collection:")
    for index in db.courses.list_indexes():
        print(f"  - {index['name']}: {index.get('key', {})}")
    
    print("\nCurrent indexes on 'user_course_data' collection:")
    for index in db.user_course_data.list_indexes():
        print(f"  - {index['name']}: {index.get('key', {})}")
    
    client.close()
    print("\nDatabase connection closed.")

if __name__ == "__main__":
    try:
        create_indexes()
    except Exception as e:
        print(f"\n❌ Error creating indexes: {e}")
        sys.exit(1)
