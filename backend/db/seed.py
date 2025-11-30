import json
import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = BASE_DIR / "data" / "seed.json"
DB_PATH = BASE_DIR / "megamind.db"

def main():
    """Seed the database with initial data."""
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Seed data missing at {DATA_PATH}")

    with DATA_PATH.open() as seed_file:
        data = json.load(seed_file)

    if DB_PATH.exists():
        DB_PATH.unlink()

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Create tables
    cursor.execute("""
        CREATE TABLE users (
            id TEXT PRIMARY KEY,
            email TEXT NOT NULL,
            display_name TEXT NOT NULL,
            focus_course_id TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE courses (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            source TEXT,
            status TEXT NOT NULL,
            notes TEXT,
            tags TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE lectures (
            id TEXT PRIMARY KEY,
            course_id TEXT NOT NULL,
            "order" INTEGER NOT NULL,
            title TEXT NOT NULL,
            video_url TEXT,
            status TEXT NOT NULL,
            duration_minutes INTEGER,
            note TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (course_id) REFERENCES courses (id)
        )
    """)

    cursor.execute("""
        CREATE TABLE assignments (
            id TEXT PRIMARY KEY,
            course_id TEXT NOT NULL,
            title TEXT NOT NULL,
            status TEXT NOT NULL,
            due_date TEXT,
            link TEXT,
            note TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (course_id) REFERENCES courses (id)
        )
    """)

    # Insert data
    user = data["user"]
    cursor.execute(
        "INSERT INTO users VALUES (?, ?, ?, ?, ?, ?)",
        (
            user["id"],
            user["email"],
            user["displayName"],
            user["focusCourseId"],
            user["createdAt"],
            user["updatedAt"],
        ),
    )

    for course in data["courses"]:
        cursor.execute(
            "INSERT INTO courses VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (
                course["id"],
                course["title"],
                course["description"],
                course["source"],
                course["status"],
                course["notes"],
                json.dumps(course.get("tags", [])),
                course["createdAt"],
                course["updatedAt"],
            ),
        )

        for lecture in course.get("lectures", []):
            cursor.execute(
                "INSERT INTO lectures VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (
                    lecture["id"],
                    lecture["courseId"],
                    lecture["order"],
                    lecture["title"],
                    lecture["videoUrl"],
                    lecture["status"],
                    lecture.get("durationMinutes"),
                    lecture.get("note", ""),
                    lecture["createdAt"],
                    lecture["updatedAt"],
                ),
            )

        for assignment in course.get("assignments", []):
            cursor.execute(
                "INSERT INTO assignments VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (
                    assignment["id"],
                    assignment["courseId"],
                    assignment["title"],
                    assignment["status"],
                    assignment.get("dueDate"),
                    assignment.get("link"),
                    assignment.get("note", ""),
                    assignment["createdAt"],
                    assignment["updatedAt"],
                ),
            )

    conn.commit()
    conn.close()
    print("Database seeded successfully!")


if __name__ == "__main__":
    main()
