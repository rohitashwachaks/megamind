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
    def get_user(self) -> Optional[Dict[str, Any]]:
        """Retrieve the user."""
        pass

    @abstractmethod
    def get_courses(self) -> List[Dict[str, Any]]:
        """Retrieve all courses."""
        pass

    @abstractmethod
    def get_course(self, course_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve a single course by its ID."""
        pass

    @abstractmethod
    def update_user_profile(self, display_name: str) -> Optional[Dict[str, Any]]:
        """Update the user's profile."""
        pass

    @abstractmethod
    def set_focus_course(self, course_id: Optional[str]) -> Optional[Dict[str, Any]]:
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
