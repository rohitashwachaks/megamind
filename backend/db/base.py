from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional


class DatabaseConnector(ABC):
    """Abstract base class for a database connector."""

    @abstractmethod
    def connect(self, **kwargs):
        """Connect to the database."""
        pass

    @abstractmethod
    def close(self):
        """Close the database connection."""
        pass

    @abstractmethod
    def get_user(self, user_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Retrieve a user by ID. If no ID provided, returns the default user (Phase 1 compatibility)."""
        pass

    @abstractmethod
    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Retrieve a user by email address (for authentication)."""
        pass

    @abstractmethod
    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new user account (Phase 2)."""
        pass

    @abstractmethod
    def get_courses(self) -> List[Dict[str, Any]]:
        """Retrieve all courses from the catalog (public data)."""
        pass

    @abstractmethod
    def get_course(self, course_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve a single course by its ID from the catalog (public data)."""
        pass

    @abstractmethod
    def update_user_profile(self, user_id: str, display_name: str) -> Optional[Dict[str, Any]]:
        """Update the user's profile."""
        pass

    @abstractmethod
    def set_focus_course(self, user_id: str, course_id: Optional[str]) -> Optional[Dict[str, Any]]:
        """Set the user's focus course."""
        pass

    @abstractmethod
    def create_course(self, new_course: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new course."""
        pass

    @abstractmethod
    def update_course(self, course_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update an existing course."""
        pass

    @abstractmethod
    def create_lecture(self, course_id: str, new_lecture: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new lecture for a course."""
        pass

    @abstractmethod
    def update_lecture(self, course_id: str, lecture_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update an existing lecture."""
        pass

    @abstractmethod
    def create_assignment(self, course_id: str, new_assignment: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new assignment for a course."""
        pass

    @abstractmethod
    def update_assignment(self, course_id: str, assignment_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update an existing assignment."""
        pass

    @abstractmethod
    def delete_course_cascading(self, course_id: str) -> None:
        """Delete a course and all its associated data."""
        pass

    @abstractmethod
    def delete_lecture(self, course_id: str, lecture_id: str) -> None:
        """Delete a lecture from a course."""
        pass

    @abstractmethod
    def delete_assignment(self, course_id: str, assignment_id: str) -> None:
        """Delete an assignment from a course."""
        pass

    # UserCourseData methods
    @abstractmethod
    def get_user_course_data(self, user_id: str, course_id: str) -> Optional[Dict[str, Any]]:
        """Get user-specific data for a course."""
        pass

    @abstractmethod
    def get_all_user_course_data(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all user course data for a specific user."""
        pass

    @abstractmethod
    def create_user_course_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create user course enrollment data."""
        pass

    @abstractmethod
    def update_user_course_data(self, user_id: str, course_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update user-specific course data."""
        pass

    @abstractmethod
    def update_user_lecture_data(self, user_id: str, course_id: str, lecture_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update user-specific lecture data (status, notes)."""
        pass

    @abstractmethod
    def update_user_assignment_data(self, user_id: str, course_id: str, assignment_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update user-specific assignment data (status, notes, due date)."""
        pass

    @abstractmethod
    def delete_user_course_data(self, user_id: str, course_id: str) -> None:
        """Delete user course data (unenroll)."""
        pass

    @abstractmethod
    def get_enriched_courses(self, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get courses enriched with user data if user_id provided, otherwise return catalog only."""
        pass
