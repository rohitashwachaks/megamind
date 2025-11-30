import json
import sqlite3
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from .base import DatabaseConnector


class SqlConnector(DatabaseConnector):
    """Connector for a SQL database (using sqlite3)."""

    def __init__(self, db_path="megamind.db"):
        self.db_path = db_path
        self.conn = None

    def connect(self, **kwargs):
        """Connect to the SQLite database."""
        self.conn = sqlite3.connect(self.db_path)
        self.conn.row_factory = sqlite3.Row

    def close(self):
        """Close the database connection."""
        if self.conn:
            self.conn.close()

    def _row_to_dict(self, row: sqlite3.Row) -> Dict[str, Any]:
        """Converts a sqlite3.Row object to a dictionary."""
        return dict(row)

    def get_user(self) -> Optional[Dict[str, Any]]:
        """Retrieve the user."""
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM users LIMIT 1")
        user = cursor.fetchone()
        return self._row_to_dict(user) if user else None

    def get_courses(self) -> List[Dict[str, Any]]:
        """Retrieve all courses with their lectures and assignments."""
        cursor = self.conn.cursor()

        # Fetch all courses
        cursor.execute("SELECT * FROM courses")
        courses = {c["id"]: self._row_to_dict(c) for c in cursor.fetchall()}

        # Initialize and process nested objects
        for course in courses.values():
            course["tags"] = json.loads(course["tags"])
            course["lectures"] = []
            course["assignments"] = []

        # Fetch and associate lectures
        cursor.execute("SELECT * FROM lectures ORDER BY \"order\"")
        for lecture in cursor.fetchall():
            if lecture["course_id"] in courses:
                courses[lecture["course_id"]]["lectures"].append(self._row_to_dict(lecture))

        # Fetch and associate assignments
        cursor.execute("SELECT * FROM assignments ORDER BY created_at")
        for assignment in cursor.fetchall():
            if assignment["course_id"] in courses:
                courses[assignment["course_id"]]["assignments"].append(self._row_to_dict(assignment))

        return list(courses.values())

    def get_course(self, course_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve a single course by its ID with lectures and assignments."""
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM courses WHERE id = ?", (course_id,))
        course_row = cursor.fetchone()

        if not course_row:
            return None

        course = self._row_to_dict(course_row)
        course["tags"] = json.loads(course["tags"])

        # Fetch lectures
        cursor.execute("SELECT * FROM lectures WHERE course_id = ? ORDER BY \"order\"", (course_id,))
        course["lectures"] = [self._row_to_dict(row) for row in cursor.fetchall()]

        # Fetch assignments
        cursor.execute("SELECT * FROM assignments WHERE course_id = ? ORDER BY created_at", (course_id,))
        course["assignments"] = [self._row_to_dict(row) for row in cursor.fetchall()]

        return course

    def now_iso(self) -> str:
        return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")

    def update_user_profile(self, display_name: str) -> Optional[Dict[str, Any]]:
        """Update the user's profile."""
        # To be implemented
        return None

    def set_focus_course(self, course_id: Optional[str]) -> Optional[Dict[str, Any]]:
        """Set the user's focus course."""
        # To be implemented
        return None

    def create_course(self, new_course: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new course."""
        # To be implemented
        return new_course

    def update_course(self, course_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update an existing course."""
        # To be implemented
        return None

    def create_lecture(self, course_id: str, new_lecture: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new lecture for a course."""
        # To be implemented
        return new_lecture

    def update_lecture(self, course_id: str, lecture_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update an existing lecture."""
        # To be implemented
        return None

    def create_assignment(self, course_id: str, new_assignment: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new assignment for a course."""
        # To be implemented
        return new_assignment

    def update_assignment(self, course_id: str, assignment_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update an existing assignment."""
        # To be implemented
        return None
