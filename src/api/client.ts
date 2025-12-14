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

/**
 * A wrapper around fetch to handle API requests, responses, and errors.
 * It automatically adds the base URL and JSON content type header.
 * @param path The API endpoint path.
 * @param options The request options.
 * @param token Optional authentication token.
 * @returns The response payload.
 */
const request = async <T>(path: string, options: RequestInit = {}, token?: string | null): Promise<T> => {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };
  
  // Add any additional headers from options
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, options.headers);
    }
  }
  
  // Add Authorization header if token is provided
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    headers,
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
  /**
   * Register a new user account.
   */
  register: (email: string, password: string, confirmPassword: string, displayName?: string) =>
    request<{ user: User; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, confirmPassword, displayName })
    }),
  /**
   * Login with email and password.
   */
  login: (email: string, password: string) =>
    request<{ user: User; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    }),
  /**
   * Fetches the current user's profile.
   */
  getCurrentUser: (token?: string | null) => request<User>("/users/me", {}, token),
  /**
   * Updates the current user's display name.
   */
  updateProfile: (payload: { displayName: string }, token?: string | null) =>
    request<User>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(payload)
    }, token),
  /**
   * Sets the user's focus course.
   */
  setFocusCourse: (courseId?: string | null, token?: string | null) =>
    request<User>("/users/me/focus-course", {
      method: "PATCH",
      body: JSON.stringify({ courseId: courseId ?? null })
    }, token),
  /**
   * Export all user data for backup.
   */
  exportUserData: (token?: string | null) =>
    request<{ user: User; courses: Course[]; exportedAt: string; version: string }>("/users/me/export", {}, token),
  /**
   * Fetches all courses.
   */
  getCourses: (token?: string | null) => request<Course[]>("/courses", {}, token),
  /**
   * Fetches a single course by its ID.
   */
  getCourse: (courseId: string) => request<Course>(`/courses/${courseId}`),
  /**
   * Creates a new course.
   */
  createCourse: (payload: NewCoursePayload) =>
    request<Course>("/courses", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  /**
   * Updates a course.
   */
  updateCourse: (courseId: string, payload: UpdateCoursePayload) =>
    request<Course>(`/courses/${courseId}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    }),
  /**
   * Deletes a course.
   */
  deleteCourse: (courseId: string) =>
    request<void>(`/courses/${courseId}`, { method: "DELETE" }),
  /**
   * Creates a new lecture for a course.
   */
  createLecture: (courseId: string, payload: NewLecturePayload) =>
    request<Lecture>(`/courses/${courseId}/lectures`, {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  /**
   * Updates a lecture.
   */
  updateLecture: (courseId: string, lectureId: string, payload: UpdateLecturePayload) =>
    request<Lecture>(`/courses/${courseId}/lectures/${lectureId}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    }),
  /**
   * Deletes a lecture.
   */
  deleteLecture: (courseId: string, lectureId: string) =>
    request<void>(`/courses/${courseId}/lectures/${lectureId}`, { method: "DELETE" }),
  /**
   * Creates a new assignment for a course.
   */
  createAssignment: (courseId: string, payload: NewAssignmentPayload) =>
    request<Assignment>(`/courses/${courseId}/assignments`, {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  /**
   * Updates an assignment.
   */
  updateAssignment: (
    courseId: string,
    assignmentId: string,
    payload: UpdateAssignmentPayload
  ) =>
    request<Assignment>(`/courses/${courseId}/assignments/${assignmentId}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    }),
  /**
   * Deletes an assignment.
   */
  deleteAssignment: (courseId: string, assignmentId: string) =>
    request<void>(`/courses/${courseId}/assignments/${assignmentId}`, {
      method: "DELETE"
    })
};

export { toMessage };
