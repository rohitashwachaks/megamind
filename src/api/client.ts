import {
  Assignment,
  Course,
  Lecture,
  NewAssignmentPayload,
  NewCoursePayload,
  NewLecturePayload,
  UpdateAssignmentPayload,
  UpdateCoursePayload,
  UpdateLecturePayload,
  User
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

type ApiEnvelope<T> = {
  data: T;
  meta?: Record<string, unknown>;
};

type ApiError = {
  error?: {
    code?: string;
    message?: string;
    fields?: Record<string, string>;
  };
};

const toMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong. Please try again.";

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const text = await response.text();
  const json = text ? (JSON.parse(text) as ApiEnvelope<T> & ApiError) : null;

  if (!response.ok) {
    const message = json?.error?.message || response.statusText;
    throw new Error(message || "Request failed");
  }

  if (json && "data" in json) {
    return (json as ApiEnvelope<T>).data;
  }

  throw new Error("Unexpected response from server");
};

export const apiClient = {
  getCurrentUser: () => request<User>("/users/me"),
  updateProfile: (payload: { displayName: string }) =>
    request<User>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(payload)
    }),
  setFocusCourse: (courseId?: string | null) =>
    request<User>("/users/me/focus-course", {
      method: "PATCH",
      body: JSON.stringify({ courseId: courseId ?? null })
    }),
  getCourses: () => request<Course[]>("/courses"),
  createCourse: (payload: NewCoursePayload) =>
    request<Course>("/courses", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  updateCourse: (courseId: string, payload: UpdateCoursePayload) =>
    request<Course>(`/courses/${courseId}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    }),
  createLecture: (courseId: string, payload: NewLecturePayload) =>
    request<Lecture>(`/courses/${courseId}/lectures`, {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  updateLecture: (courseId: string, lectureId: string, payload: UpdateLecturePayload) =>
    request<Lecture>(`/courses/${courseId}/lectures/${lectureId}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    }),
  createAssignment: (courseId: string, payload: NewAssignmentPayload) =>
    request<Assignment>(`/courses/${courseId}/assignments`, {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  updateAssignment: (
    courseId: string,
    assignmentId: string,
    payload: UpdateAssignmentPayload
  ) =>
    request<Assignment>(`/courses/${courseId}/assignments/${assignmentId}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    })
};

export { toMessage };
