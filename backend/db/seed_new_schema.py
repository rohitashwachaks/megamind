"""
Database Seeding Script for New Schema

This script seeds the database with the new schema design:
- Courses collection: Public catalog data only
- Users collection: User accounts
- UserCourseData collection: User-specific progress and notes

Run this to set up a fresh database or migrate from the old schema.
"""

import json
import os
import sys
import uuid
from datetime import datetime, timezone
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "megamind")


def now_iso():
    """Generate current ISO timestamp."""
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def seed_database():
    """Seed the database with sample data."""
    
    # Connect to MongoDB
    print(f"Connecting to MongoDB at {MONGO_URI}...")
    client = MongoClient(MONGO_URI)
    db = client[MONGO_DB_NAME]
    
    print(f"Seeding database: {MONGO_DB_NAME}")
    
    # Clear existing data (optional - comment out to preserve existing data)
    print("\nClearing existing collections...")
    db.users.delete_many({})
    db.courses.delete_many({})
    db.user_course_data.delete_many({})
    print("✓ Collections cleared")
    
    # =========================================================================
    # Seed Courses (Public Catalog)
    # =========================================================================
    print("\nSeeding courses (public catalog)...")
    
    courses = [
        {
            "id": "mit-18.S096",
            "title": "18.S096 Topics In Mathematics With Applications In Finance",
            "description": "Mathematical concepts and techniques used in the financial industry.",
            "source": "https://ocw.mit.edu/courses/18-s096-topics-in-mathematics-with-applications-in-finance-fall-2013/",
            "tags": ["quantitative-finance", "mathematics", "intro"],
            "lectures": [
                {
                    "id": "p1",
                    "order": 1,
                    "title": "Lecture 1 – Introduction, Financial Terms and Concepts",
                    "videoUrl": "https://ocw.mit.edu/courses/18-s096-topics-in-mathematics-with-applications-in-finance-fall-2013/resources/lecture-1-introduction-financial-terms-and-concepts/",
                    "durationMinutes": 61,
                    "createdAt": now_iso(),
                    "updatedAt": now_iso()
                }
            ],
            "assignments": [],
            "createdAt": now_iso(),
            "updatedAt": now_iso()
        },
        {
            "id": "mit-6006",
            "title": "6.006 Introduction to Algorithms (Spring 2008)",
            "description": "Design and analysis of algorithms with practical problem-solving. Based on MIT OCW.",
            "source": "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2008/",
            "tags": ["algorithms", "computer science"],
            "lectures": [
                {
                    "id": "l1",
                    "order": 1,
                    "title": "Lecture 1 – Algorithmic Thinking",
                    "videoUrl": "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2020/resources/lecture-1-introduction",
                    "durationMinutes": 50,
                    "createdAt": now_iso(),
                    "updatedAt": now_iso()
                },
                {
                    "id": "l2",
                    "order": 2,
                    "title": "Lecture 2 – Divide and Conquer",
                    "videoUrl": "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2020/resources/lecture-2-divide-and-conquer",
                    "durationMinutes": 55,
                    "createdAt": now_iso(),
                    "updatedAt": now_iso()
                },
                {
                    "id": "l3",
                    "order": 3,
                    "title": "Lecture 3 – Asymptotic Notation",
                    "videoUrl": "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2020/resources/lecture-3-asymptotic-notation",
                    "durationMinutes": 50,
                    "createdAt": now_iso(),
                    "updatedAt": now_iso()
                }
            ],
            "assignments": [
                {
                    "id": "a1",
                    "title": "Problem Set 1 – Divide & Conquer",
                    "link": "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2020/resources/ps1-divide-and-conquer/",
                    "createdAt": now_iso(),
                    "updatedAt": now_iso()
                },
                {
                    "id": "a2",
                    "title": "Problem Set 2 – Growth of Functions",
                    "link": "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2020/resources/ps2-growth-of-functions/",
                    "createdAt": now_iso(),
                    "updatedAt": now_iso()
                }
            ],
            "createdAt": now_iso(),
            "updatedAt": now_iso()
        },
        {
            "id": "mit-60001",
            "title": "6.0001 Introduction to Computer Science and Programming",
            "description": "Python-first intro to CS from MIT OCW. Good for fundamentals and brushing up.",
            "source": "https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016",
            "tags": ["python", "intro"],
            "lectures": [
                {
                    "id": "p1-mit-60001",
                    "order": 1,
                    "title": "Lecture 1 – What is Computation?",
                    "videoUrl": "https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/resources/lecture-1-what-is-computation/",
                    "durationMinutes": 45,
                    "createdAt": now_iso(),
                    "updatedAt": now_iso()
                },
                {
                    "id": "p2",
                    "order": 2,
                    "title": "Lecture 2 – Branching and Iteration",
                    "videoUrl": "https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/resources/lecture-2-branching-and-iteration/",
                    "durationMinutes": 50,
                    "createdAt": now_iso(),
                    "updatedAt": now_iso()
                }
            ],
            "assignments": [
                {
                    "id": "a1-mit-60001",
                    "title": "Problem Set 1 – Python Basics",
                    "link": "https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/resources/ps1/",
                    "createdAt": now_iso(),
                    "updatedAt": now_iso()
                }
            ],
            "createdAt": now_iso(),
            "updatedAt": now_iso()
        }
    ]
    
    db.courses.insert_many(courses)
    print(f"✓ Inserted {len(courses)} courses into catalog")
    
    # =========================================================================
    # Seed Demo User (optional)
    # =========================================================================
    print("\nSeeding demo user...")
    
    from werkzeug.security import generate_password_hash
    
    demo_user = {
        "id": "user-demo",
        "email": "demo@pocketschool.app",
        "passwordHash": generate_password_hash("password123"),
        "displayName": "Demo Learner",
        "focusCourseId": "mit-6006",
        "createdAt": now_iso(),
        "updatedAt": now_iso()
    }
    
    db.users.insert_one(demo_user)
    print(f"✓ Created demo user: {demo_user['email']} (password: password123)")
    
    # =========================================================================
    # Seed Demo User Course Data
    # =========================================================================
    print("\nSeeding demo user course data...")
    
    # Demo user enrolled in algorithms course with progress
    user_course_1 = {
        "id": str(uuid.uuid4()),
        "userId": "user-demo",
        "courseId": "mit-6006",
        "status": "active",
        "notes": "Focus course for the month. Aim for 2 lectures per week.",
        "lectures": [
            {
                "lectureId": "l1",
                "status": "completed",
                "note": "Solid intro; revisit recursion tree examples.",
                "updatedAt": now_iso()
            },
            {
                "lectureId": "l2",
                "status": "in_progress",
                "note": "",
                "updatedAt": now_iso()
            }
        ],
        "assignments": [
            {
                "assignmentId": "a1",
                "status": "in_progress",
                "dueDate": "2024-02-01",
                "note": "",
                "updatedAt": now_iso()
            }
        ],
        "createdAt": now_iso(),
        "updatedAt": now_iso()
    }
    
    # Demo user also enrolled in Python course
    user_course_2 = {
        "id": str(uuid.uuid4()),
        "userId": "user-demo",
        "courseId": "mit-60001",
        "status": "active",
        "notes": "Use this for lighter sessions. Pair with small coding exercises.",
        "lectures": [
            {
                "lectureId": "p1-mit-60001",
                "status": "completed",
                "note": "Keep notes on problem-solving framework.",
                "updatedAt": now_iso()
            }
        ],
        "assignments": [],
        "createdAt": now_iso(),
        "updatedAt": now_iso()
    }
    
    db.user_course_data.insert_many([user_course_1, user_course_2])
    print(f"✓ Created user course data for 2 enrolled courses")
    
    print("\n✅ Database seeded successfully!")
    
    # Print summary
    print("\n" + "="*60)
    print("DATABASE SUMMARY")
    print("="*60)
    print(f"Courses (catalog):        {db.courses.count_documents({})}")
    print(f"Users:                    {db.users.count_documents({})}")
    print(f"User Course Enrollments:  {db.user_course_data.count_documents({})}")
    print("="*60)
    
    client.close()
    print("\nDatabase connection closed.")


if __name__ == "__main__":
    try:
        seed_database()
    except Exception as e:
        print(f"\n❌ Error seeding database: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
