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
        """Retrieve all courses from the catalog (public data only)."""
        courses = self.db.courses.find()
        return [self._document_to_dict(c) for c in courses]

    def get_course(self, course_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve a single course by its ID from the catalog (public data only)."""
        course = self.db.courses.find_one({"id": course_id})
        return self._document_to_dict(course) if course else None

    def now_iso(self) -> str:
        return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")

    def update_user_profile(self, user_id: str, display_name: str) -> Optional[Dict[str, Any]]:
        """Update the user's profile."""
        updated_user = self.db.users.find_one_and_update(
            {"id": user_id},
            {"$set": {"displayName": display_name, "updatedAt": self.now_iso()}},
            return_document=ReturnDocument.AFTER,
        )
        return self._document_to_dict(updated_user) if updated_user else None

    def set_focus_course(self, user_id: str, course_id: Optional[str]) -> Optional[Dict[str, Any]]:
        """Set the user's focus course."""
        updated_user = self.db.users.find_one_and_update(
            {"id": user_id},
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
        """Update lecture metadata in the course catalog."""
        updates["updatedAt"] = self.now_iso()
        # Create a dictionary of updates with the "lectures.$" prefix
        update_fields = {f"lectures.$.{key}": value for key, value in updates.items()}
        update_fields["updatedAt"] = self.now_iso()

        self.db.courses.update_one(
            {"id": course_id, "lectures.id": lecture_id},
            {"$set": update_fields},
        )
        updated_course = self.get_course(course_id)
        if updated_course and "lectures" in updated_course:
            return next((l for l in updated_course["lectures"] if l["id"] == lecture_id), None)
        return None

    def create_assignment(self, course_id: str, new_assignment: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new assignment for a course."""
        self.db.courses.update_one(
            {"id": course_id},
            {"$push": {"assignments": new_assignment}, "$set": {"updatedAt": self.now_iso()}},
        )
        return new_assignment

    def update_assignment(self, course_id: str, assignment_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update assignment metadata in the course catalog."""
        updates["updatedAt"] = self.now_iso()
        # Create a dictionary of updates with the "assignments.$" prefix
        update_fields = {f"assignments.$.{key}": value for key, value in updates.items()}
        update_fields["updatedAt"] = self.now_iso()

        self.db.courses.update_one(
            {"id": course_id, "assignments.id": assignment_id},
            {"$set": update_fields},
        )
        updated_course = self.get_course(course_id)
        if updated_course and "assignments" in updated_course:
            return next((a for a in updated_course["assignments"] if a["id"] == assignment_id), None)
        return None

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

    # UserCourseData methods
    def get_user_course_data(self, user_id: str, course_id: str) -> Optional[Dict[str, Any]]:
        """Get user-specific data for a course."""
        user_course = self.db.user_course_data.find_one({"userId": user_id, "courseId": course_id})
        return self._document_to_dict(user_course) if user_course else None

    def get_all_user_course_data(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all user course data for a specific user."""
        user_courses = self.db.user_course_data.find({"userId": user_id})
        return [self._document_to_dict(uc) for uc in user_courses]

    def create_user_course_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create user course enrollment data."""
        # Check if already exists
        existing = self.get_user_course_data(data["userId"], data["courseId"])
        if existing:
            return existing
        
        self.db.user_course_data.insert_one(data)
        return self._document_to_dict(data)

    def update_user_course_data(self, user_id: str, course_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update user-specific course data."""
        updates["updatedAt"] = self.now_iso()
        updated = self.db.user_course_data.find_one_and_update(
            {"userId": user_id, "courseId": course_id},
            {"$set": updates},
            return_document=ReturnDocument.AFTER,
        )
        return self._document_to_dict(updated) if updated else None

    def update_user_lecture_data(self, user_id: str, course_id: str, lecture_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update user-specific lecture data (status, notes)."""
        updates["updatedAt"] = self.now_iso()
        
        # First, get the user course data
        user_course = self.get_user_course_data(user_id, course_id)
        if not user_course:
            return None
        
        # Check if lecture data exists
        lecture_exists = any(l["lectureId"] == lecture_id for l in user_course.get("lectures", []))
        
        if lecture_exists:
            # Update existing lecture data
            update_fields = {f"lectures.$.{key}": value for key, value in updates.items()}
            self.db.user_course_data.update_one(
                {"userId": user_id, "courseId": course_id, "lectures.lectureId": lecture_id},
                {"$set": update_fields},
            )
        else:
            # Add new lecture data
            lecture_data = {"lectureId": lecture_id, **updates}
            self.db.user_course_data.update_one(
                {"userId": user_id, "courseId": course_id},
                {"$push": {"lectures": lecture_data}},
            )
        
        # Update parent updatedAt
        self.db.user_course_data.update_one(
            {"userId": user_id, "courseId": course_id},
            {"$set": {"updatedAt": self.now_iso()}},
        )
        
        return self.get_user_course_data(user_id, course_id)

    def update_user_assignment_data(self, user_id: str, course_id: str, assignment_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update user-specific assignment data (status, notes, due date)."""
        updates["updatedAt"] = self.now_iso()
        
        # First, get the user course data
        user_course = self.get_user_course_data(user_id, course_id)
        if not user_course:
            return None
        
        # Check if assignment data exists
        assignment_exists = any(a["assignmentId"] == assignment_id for a in user_course.get("assignments", []))
        
        if assignment_exists:
            # Update existing assignment data
            update_fields = {f"assignments.$.{key}": value for key, value in updates.items()}
            self.db.user_course_data.update_one(
                {"userId": user_id, "courseId": course_id, "assignments.assignmentId": assignment_id},
                {"$set": update_fields},
            )
        else:
            # Add new assignment data
            assignment_data = {"assignmentId": assignment_id, **updates}
            self.db.user_course_data.update_one(
                {"userId": user_id, "courseId": course_id},
                {"$push": {"assignments": assignment_data}},
            )
        
        # Update parent updatedAt
        self.db.user_course_data.update_one(
            {"userId": user_id, "courseId": course_id},
            {"$set": {"updatedAt": self.now_iso()}},
        )
        
        return self.get_user_course_data(user_id, course_id)

    def delete_user_course_data(self, user_id: str, course_id: str) -> None:
        """Delete user course data (unenroll)."""
        self.db.user_course_data.delete_one({"userId": user_id, "courseId": course_id})

    def get_enriched_courses(self, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get courses enriched with user data if user_id provided, otherwise return catalog only."""
        # Get all courses from catalog
        courses = self.get_courses()
        
        if not user_id:
            # Return public catalog data without user-specific info
            return courses
        
        # Get all user course data
        user_courses = {uc["courseId"]: uc for uc in self.get_all_user_course_data(user_id)}
        
        # Enrich courses with user data
        enriched = []
        for course in courses:
            enriched_course = course.copy()
            user_course = user_courses.get(course["id"])
            
            if user_course:
                # Add user-specific course fields
                enriched_course["status"] = user_course.get("status", "active")
                enriched_course["notes"] = user_course.get("notes", "")
                
                # Create lookup maps for user lecture/assignment data
                user_lectures = {ul["lectureId"]: ul for ul in user_course.get("lectures", [])}
                user_assignments = {ua["assignmentId"]: ua for ua in user_course.get("assignments", [])}
                
                # Enrich lectures
                enriched_lectures = []
                for lecture in course.get("lectures", []):
                    enriched_lecture = lecture.copy()
                    user_lecture = user_lectures.get(lecture["id"])
                    if user_lecture:
                        enriched_lecture["status"] = user_lecture.get("status", "not_started")
                        enriched_lecture["note"] = user_lecture.get("note", "")
                    else:
                        enriched_lecture["status"] = "not_started"
                        enriched_lecture["note"] = ""
                    enriched_lectures.append(enriched_lecture)
                enriched_course["lectures"] = enriched_lectures
                
                # Enrich assignments
                enriched_assignments = []
                for assignment in course.get("assignments", []):
                    enriched_assignment = assignment.copy()
                    user_assignment = user_assignments.get(assignment["id"])
                    if user_assignment:
                        enriched_assignment["status"] = user_assignment.get("status", "not_started")
                        enriched_assignment["note"] = user_assignment.get("note", "")
                        enriched_assignment["dueDate"] = user_assignment.get("dueDate", "")
                    else:
                        enriched_assignment["status"] = "not_started"
                        enriched_assignment["note"] = ""
                    enriched_assignments.append(enriched_assignment)
                enriched_course["assignments"] = enriched_assignments
            else:
                # User hasn't enrolled, add default values
                enriched_course["status"] = "active"
                enriched_course["notes"] = ""
                for lecture in enriched_course.get("lectures", []):
                    lecture["status"] = "not_started"
                    lecture["note"] = ""
                for assignment in enriched_course.get("assignments", []):
                    assignment["status"] = "not_started"
                    assignment["note"] = ""
            
            enriched.append(enriched_course)
        
        return enriched
