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

    def get_user(self, user_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Retrieve a user by ID. If no ID provided, returns the first user (Phase 1 compatibility)."""
        cursor = self.conn.cursor()
        if user_id:
            cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        else:
            cursor.execute("SELECT * FROM users LIMIT 1")
        user = cursor.fetchone()
        return self._row_to_dict(user) if user else None

    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Retrieve a user by email address (for authentication)."""
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()
        return self._row_to_dict(user) if user else None

    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new user account (Phase 2)."""
        cursor = self.conn.cursor()
        cursor.execute(
            "INSERT INTO users (id, email, passwordHash, displayName, focusCourseId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (user_data["id"], user_data["email"], user_data["passwordHash"], 
             user_data["displayName"], user_data.get("focusCourseId"), 
             user_data["createdAt"], user_data["updatedAt"])
        )
        self.conn.commit()
        return user_data

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

    def update_user_profile(self, user_id: str, display_name: str) -> Optional[Dict[str, Any]]:
        """Update the user's profile."""
        # To be implemented
        return None

    def set_focus_course(self, user_id: str, course_id: Optional[str]) -> Optional[Dict[str, Any]]:
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

    def delete_course_cascading(self, course_id: str) -> None:
        """Delete a course and all its associated data."""
        # To be implemented
        pass

    def delete_lecture(self, course_id: str, lecture_id: str) -> None:
        """Delete a lecture from a course."""
        # To be implemented
        pass

    def delete_assignment(self, course_id: str, assignment_id: str) -> None:
        """Delete an assignment from a course."""
        # To be implemented
        pass

    # UserCourseData methods (to be implemented for SQL)
    def get_user_course_data(self, user_id: str, course_id: str) -> Optional[Dict[str, Any]]:
        """Get user-specific data for a course."""
        # To be implemented
        return None

    def get_all_user_course_data(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all user course data for a specific user."""
        # To be implemented
        return []

    def create_user_course_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create user course enrollment data."""
        # To be implemented
        return data

    def update_user_course_data(self, user_id: str, course_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update user-specific course data."""
        # To be implemented
        return None

    def update_user_lecture_data(self, user_id: str, course_id: str, lecture_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update user-specific lecture data (status, notes)."""
        # To be implemented
        return None

    def update_user_assignment_data(self, user_id: str, course_id: str, assignment_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update user-specific assignment data (status, notes, due date)."""
        # To be implemented
        return None

    def delete_user_course_data(self, user_id: str, course_id: str) -> None:
        """Delete user course data (unenroll)."""
        # To be implemented
        pass

    def get_enriched_courses(self, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get courses enriched with user data if user_id provided, otherwise return catalog only."""
        # To be implemented - for now, just return basic courses
        return self.get_courses()
