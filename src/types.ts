export type CourseStatus = "active" | "completed" | "parked";
export type LectureStatus = "not_started" | "in_progress" | "completed";
export type AssignmentStatus = "not_started" | "in_progress" | "submitted" | "skipped";

export interface Lecture {
  id: string;
  title: string;
  order: number;
  videoUrl: string;
  status: LectureStatus;
  durationMinutes?: number;
  note?: string;
}

export interface Assignment {
  id: string;
  title: string;
  status: AssignmentStatus;
  dueDate?: string;
  link?: string;
  note?: string;
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
}

export interface AppState {
  userName: string;
  focusCourseId?: string;
  courses: Course[];
}
