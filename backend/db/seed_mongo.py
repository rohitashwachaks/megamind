import json
from pathlib import Path

from pymongo import MongoClient

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = BASE_DIR / "data" / "seed.json"

def main():
    """Seed the MongoDB database with initial data."""
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Seed data missing at {DATA_PATH}")

    with DATA_PATH.open() as seed_file:
        data = json.load(seed_file)

    client = MongoClient("mongodb://localhost:27017/")
    db = client.pocketschool

    # Clear existing data
    db.users.delete_many({})
    db.courses.delete_many({})

    # Insert data
    user = data["user"]
    db.users.insert_one(user)

    courses = data["courses"]
    if courses:
        db.courses.insert_many(courses)

    client.close()
    print("MongoDB database seeded successfully!")


if __name__ == "__main__":
    main()
