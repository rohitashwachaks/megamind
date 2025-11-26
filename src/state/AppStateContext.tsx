import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer
} from "react";
import {
  AppState,
  Assignment,
  AssignmentStatus,
  Course,
  CourseStatus,
  Lecture,
  LectureStatus
} from "../types";
import { seedState } from "../data/seed";

const STORAGE_KEY = "megamind-state-v1";

type Action =
  | { type: "setUserName"; payload: string }
  | { type: "addCourse"; payload: Course }
  | { type: "updateCourse"; payload: { courseId: string; data: Partial<Course> } }
  | { type: "setFocusCourse"; payload?: string }
  | { type: "updateCourseNotes"; payload: { courseId: string; notes: string } }
  | { type: "addLecture"; payload: { courseId: string; lecture: Lecture } }
  | {
      type: "updateLectureStatus";
      payload: { courseId: string; lectureId: string; status: LectureStatus };
    }
  | { type: "updateLectureNote"; payload: { courseId: string; lectureId: string; note: string } }
  | { type: "addAssignment"; payload: { courseId: string; assignment: Assignment } }
  | {
      type: "updateAssignmentStatus";
      payload: { courseId: string; assignmentId: string; status: AssignmentStatus };
    }
  | { type: "updateAssignmentNote"; payload: { courseId: string; assignmentId: string; note: string } };

type ContextValue = {
  state: AppState;
  setUserName: (name: string) => void;
  addCourse: (course: Course) => void;
  updateCourse: (courseId: string, data: Partial<Course>) => void;
  setFocusCourse: (courseId?: string) => void;
  updateCourseNotes: (courseId: string, notes: string) => void;
  addLecture: (courseId: string, lecture: Lecture) => void;
  updateLectureStatus: (courseId: string, lectureId: string, status: LectureStatus) => void;
  updateLectureNote: (courseId: string, lectureId: string, note: string) => void;
  addAssignment: (courseId: string, assignment: Assignment) => void;
  updateAssignmentStatus: (
    courseId: string,
    assignmentId: string,
    status: AssignmentStatus
  ) => void;
  updateAssignmentNote: (courseId: string, assignmentId: string, note: string) => void;
};

const loadState = (): AppState => {
  if (typeof localStorage === "undefined") {
    return seedState;
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved) as AppState;
    }
  } catch (error) {
    console.warn("Failed to load saved state, using seed data.", error);
  }
  return seedState;
};

const normalizeCourseStatus = (course: Course): Course => {
  if (course.lectures.length > 0 && course.lectures.every((lecture) => lecture.status === "completed")) {
    return { ...course, status: "completed" };
  }
  if (course.status === "completed") {
    return { ...course, status: "active" };
  }
  return course;
};

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "setUserName":
      return { ...state, userName: action.payload };
    case "addCourse":
      return { ...state, courses: [...state.courses, action.payload] };
    case "updateCourse":
      return {
        ...state,
        courses: state.courses.map((course) =>
          course.id === action.payload.courseId
            ? normalizeCourseStatus({ ...course, ...action.payload.data })
            : course
        )
      };
    case "setFocusCourse":
      return { ...state, focusCourseId: action.payload };
    case "updateCourseNotes":
      return {
        ...state,
        courses: state.courses.map((course) =>
          course.id === action.payload.courseId ? { ...course, notes: action.payload.notes } : course
        )
      };
    case "addLecture":
      return {
        ...state,
        courses: state.courses.map((course) =>
          course.id === action.payload.courseId
            ? normalizeCourseStatus({
                ...course,
                lectures: [...course.lectures, action.payload.lecture].sort(
                  (a, b) => a.order - b.order
                )
              })
            : course
        )
      };
    case "updateLectureStatus":
      return {
        ...state,
        courses: state.courses.map((course) => {
          if (course.id !== action.payload.courseId) return course;
          const lectures = course.lectures.map((lecture) =>
            lecture.id === action.payload.lectureId
              ? { ...lecture, status: action.payload.status }
              : lecture
          );
          return normalizeCourseStatus({ ...course, lectures });
        })
      };
    case "updateLectureNote":
      return {
        ...state,
        courses: state.courses.map((course) =>
          course.id === action.payload.courseId
            ? {
                ...course,
                lectures: course.lectures.map((lecture) =>
                  lecture.id === action.payload.lectureId
                    ? { ...lecture, note: action.payload.note }
                    : lecture
                )
              }
            : course
        )
      };
    case "addAssignment":
      return {
        ...state,
        courses: state.courses.map((course) =>
          course.id === action.payload.courseId
            ? { ...course, assignments: [...course.assignments, action.payload.assignment] }
            : course
        )
      };
    case "updateAssignmentStatus":
      return {
        ...state,
        courses: state.courses.map((course) => {
          if (course.id !== action.payload.courseId) return course;
          const assignments = course.assignments.map((assignment) =>
            assignment.id === action.payload.assignmentId
              ? { ...assignment, status: action.payload.status }
              : assignment
          );
          return normalizeCourseStatus({ ...course, assignments });
        })
      };
    case "updateAssignmentNote":
      return {
        ...state,
        courses: state.courses.map((course) =>
          course.id === action.payload.courseId
            ? {
                ...course,
                assignments: course.assignments.map((assignment) =>
                  assignment.id === action.payload.assignmentId
                    ? { ...assignment, note: action.payload.note }
                    : assignment
                )
              }
            : course
        )
      };
    default:
      return state;
  }
};

const AppStateContext = createContext<ContextValue | null>(null);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("Failed to persist state", error);
    }
  }, [state]);

  const actions = useMemo(
    () => ({
      setUserName: (name: string) => dispatch({ type: "setUserName", payload: name }),
      addCourse: (course: Course) => dispatch({ type: "addCourse", payload: course }),
      updateCourse: (courseId: string, data: Partial<Course>) =>
        dispatch({ type: "updateCourse", payload: { courseId, data } }),
      setFocusCourse: (courseId?: string) =>
        dispatch({ type: "setFocusCourse", payload: courseId }),
      updateCourseNotes: (courseId: string, notes: string) =>
        dispatch({ type: "updateCourseNotes", payload: { courseId, notes } }),
      addLecture: (courseId: string, lecture: Lecture) =>
        dispatch({ type: "addLecture", payload: { courseId, lecture } }),
      updateLectureStatus: (courseId: string, lectureId: string, status: LectureStatus) =>
        dispatch({ type: "updateLectureStatus", payload: { courseId, lectureId, status } }),
      updateLectureNote: (courseId: string, lectureId: string, note: string) =>
        dispatch({ type: "updateLectureNote", payload: { courseId, lectureId, note } }),
      addAssignment: (courseId: string, assignment: Assignment) =>
        dispatch({ type: "addAssignment", payload: { courseId, assignment } }),
      updateAssignmentStatus: (
        courseId: string,
        assignmentId: string,
        status: AssignmentStatus
      ) => dispatch({ type: "updateAssignmentStatus", payload: { courseId, assignmentId, status } }),
      updateAssignmentNote: (courseId: string, assignmentId: string, note: string) =>
        dispatch({ type: "updateAssignmentNote", payload: { courseId, assignmentId, note } })
    }),
    []
  );

  const value = useMemo(() => ({ state, ...actions }), [state, actions]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = () => {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState must be used inside AppStateProvider");
  }
  return ctx;
};
