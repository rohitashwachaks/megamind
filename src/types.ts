export type CourseStatus = "active" | "completed" | "parked";
export type LectureStatus = "not_started" | "in_progress" | "completed";
export type AssignmentStatus = "not_started" | "in_progress" | "submitted" | "skipped";

export interface User {
  id: string;
  email: string;
  displayName: string;
  focusCourseId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Lecture {
  id: string;
  courseId: string;
  title: string;
  order: number;
  videoUrl: string;
  status: LectureStatus;
  durationMinutes?: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  status: AssignmentStatus;
  dueDate?: string;
  link?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  source: string;
  status: CourseStatus;
  lectures: Lecture[];
  assignments: Assignment[];
  notes: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  user: User | null;
  courses: Course[];
  isLoading: boolean;
  error?: string;
}

export type NewCoursePayload = {
  title: string;
  source: string;
  description?: string;
  tags?: string[];
};

export type UpdateCoursePayload = {
  title?: string;
  description?: string;
  source?: string;
  status?: CourseStatus;
  notes?: string;
  tags?: string[];
};

export type NewLecturePayload = {
  title: string;
  order: number;
  videoUrl: string;
  durationMinutes?: number;
  note?: string;
};

export type UpdateLecturePayload = {
  title?: string;
  order?: number;
  videoUrl?: string;
  durationMinutes?: number;
  status?: LectureStatus;
  note?: string;
};

export type NewAssignmentPayload = {
  title: string;
  link?: string;
  dueDate?: string;
  note?: string;
};

export type UpdateAssignmentPayload = {
  title?: string;
  status?: AssignmentStatus;
  link?: string;
  dueDate?: string;
  note?: string;
};
