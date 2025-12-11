from enum import Enum


class CourseStatus(Enum):
    ACTIVE = "active",
    COMPLETED = "completed",
    ARCHIVED = "archived"


class LectureStatus(Enum):
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",


class AssignmentStatus(Enum):
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    SUBMITTED = "submitted",
    SKIPPED = "skipped"
