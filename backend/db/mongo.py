import os
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from pymongo import MongoClient, ReturnDocument

from .base import DatabaseConnector


class MongoConnector(DatabaseConnector):
    """Connector for a MongoDB database."""

    def __init__(self, uri=None, db_name=None):
        self.uri = uri or os.getenv("MONGO_URI", "mongodb://localhost:27017/")
        self.db_name = db_name or os.getenv("MONGO_DB_NAME", "megamind")
        self.client = None
        self.db = None

    def connect(self, **kwargs):
        """Connect to the MongoDB database."""
        self.client = MongoClient(self.uri)
        self.db = self.client[self.db_name]

    def close(self):
        """Close the database connection."""
        if self.client:
            self.client.close()

    def _document_to_dict(self, doc: Dict[str, Any]) -> Dict[str, Any]:
        """Converts a MongoDB document to a dictionary, removing MongoDB's _id field."""
        if "_id" in doc:
            doc.pop("_id")
        return doc

    def get_user(self, user_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Retrieve a user by ID. If no ID provided, returns the first user (Phase 1 compatibility)."""
        if user_id:
            user = self.db.users.find_one({"id": user_id})
        else:
            # Phase 1 compatibility: return first user
            user = self.db.users.find_one()
        return self._document_to_dict(user) if user else None

    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Retrieve a user by email address (for authentication)."""
        user = self.db.users.find_one({"email": email})
        return self._document_to_dict(user) if user else None

    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new user account (Phase 2)."""
        self.db.users.insert_one(user_data)
        return self._document_to_dict(user_data)

    def get_courses(self) -> List[Dict[str, Any]]:
        """Retrieve all courses."""
        courses = self.db.courses.find()
        return [self._document_to_dict(c) for c in courses]

    def get_course(self, course_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve a single course by its ID."""
        course = self.db.courses.find_one({"id": course_id})
        return self._document_to_dict(course) if course else None

    def now_iso(self) -> str:
        return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")

    def update_user_profile(self, display_name: str) -> Optional[Dict[str, Any]]:
        """Update the user's profile."""
        user = self.get_user()
        if not user:
            return None
        updated_user = self.db.users.find_one_and_update(
            {"id": user["id"]},
            {"$set": {"displayName": display_name, "updatedAt": self.now_iso()}},
            return_document=ReturnDocument.AFTER,
        )
        return self._document_to_dict(updated_user) if updated_user else None

    def set_focus_course(self, course_id: Optional[str]) -> Optional[Dict[str, Any]]:
        """Set the user's focus course."""
        user = self.get_user()
        if not user:
            return None
        updated_user = self.db.users.find_one_and_update(
            {"id": user["id"]},
            {"$set": {"focusCourseId": course_id, "updatedAt": self.now_iso()}},
            return_document=ReturnDocument.AFTER,
        )
        return self._document_to_dict(updated_user) if updated_user else None

    def create_course(self, new_course: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new course."""
        self.db.courses.insert_one(new_course)
        # Return the course without MongoDB's _id field
        created_course = self.db.courses.find_one({"id": new_course["id"]})
        return self._document_to_dict(created_course) if created_course else new_course

    def update_course(self, course_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update an existing course."""
        updates["updatedAt"] = self.now_iso()
        updated_course = self.db.courses.find_one_and_update(
            {"id": course_id},
            {"$set": updates},
            return_document=ReturnDocument.AFTER,
        )
        return self._document_to_dict(updated_course) if updated_course else None

    def create_lecture(self, course_id: str, new_lecture: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new lecture for a course."""
        self.db.courses.update_one(
            {"id": course_id},
            {"$push": {"lectures": new_lecture}, "$set": {"updatedAt": self.now_iso()}},
        )
        return new_lecture

    def update_lecture(self, course_id: str, lecture_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update an existing lecture."""
        updates["updatedAt"] = self.now_iso()
        # Create a dictionary of updates with the "lectures.$" prefix
        update_fields = {f"lectures.$.{key}": value for key, value in updates.items()}
        update_fields["updatedAt"] = self.now_iso()

        self.db.courses.update_one(
            {"id": course_id, "lectures.id": lecture_id},
            {"$set": update_fields},
        )
        updated_course = self.get_course(course_id)
        return next((l for l in updated_course["lectures"] if l["id"] == lecture_id), None)

    def create_assignment(self, course_id: str, new_assignment: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new assignment for a course."""
        self.db.courses.update_one(
            {"id": course_id},
            {"$push": {"assignments": new_assignment}, "$set": {"updatedAt": self.now_iso()}},
        )
        return new_assignment

    def update_assignment(self, course_id: str, assignment_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update an existing assignment."""
        updates["updatedAt"] = self.now_iso()
        # Create a dictionary of updates with the "assignments.$" prefix
        update_fields = {f"assignments.$.{key}": value for key, value in updates.items()}
        update_fields["updatedAt"] = self.now_iso()

        self.db.courses.update_one(
            {"id": course_id, "assignments.id": assignment_id},
            {"$set": update_fields},
        )
        updated_course = self.get_course(course_id)
        return next((a for a in updated_course["assignments"] if a["id"] == assignment_id), None)

    def delete_course_cascading(self, course_id: str) -> None:
        """Delete a course and all its associated data (lectures and assignments are embedded)."""
        self.db.courses.delete_one({"id": course_id})

    def delete_lecture(self, course_id: str, lecture_id: str) -> None:
        """Delete a lecture from a course."""
        self.db.courses.update_one(
            {"id": course_id},
            {"$pull": {"lectures": {"id": lecture_id}}, "$set": {"updatedAt": self.now_iso()}},
        )

    def delete_assignment(self, course_id: str, assignment_id: str) -> None:
        """Delete an assignment from a course."""
        self.db.courses.update_one(
            {"id": course_id},
            {"$pull": {"assignments": {"id": assignment_id}}, "$set": {"updatedAt": self.now_iso()}},
        )
