import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer
} from "react";
import { apiClient, toMessage } from "../api/client";
import {
  AppState,
  Assignment,
  AssignmentStatus,
  Course,
  Lecture,
  LectureStatus,
  NewAssignmentPayload,
  NewCoursePayload,
  NewLecturePayload,
  UpdateAssignmentPayload,
  UpdateCoursePayload,
  UpdateLecturePayload,
  User
} from "../types";

type Action =
  | { type: "setData"; payload: { user: User; courses: Course[] } }
  | { type: "setUser"; payload: User }
  | { type: "setLoading"; payload: boolean }
  | { type: "setError"; payload?: string }
;

type ContextValue = {
  state: AppState;
  refresh: () => Promise<void>;
  setDisplayName: (name: string) => Promise<void>;
  setFocusCourse: (courseId?: string | null) => Promise<void>;
  addCourse: (course: NewCoursePayload) => Promise<void>;
  updateCourse: (courseId: string, data: UpdateCoursePayload) => Promise<void>;
  updateCourseNotes: (courseId: string, notes: string) => Promise<void>;
  addLecture: (courseId: string, lecture: NewLecturePayload) => Promise<void>;
  updateLectureStatus: (courseId: string, lectureId: string, status: LectureStatus) => Promise<void>;
  updateLectureNote: (courseId: string, lectureId: string, note: string) => Promise<void>;
  addAssignment: (courseId: string, assignment: NewAssignmentPayload) => Promise<void>;
  updateAssignmentStatus: (
    courseId: string,
    assignmentId: string,
    status: AssignmentStatus
  ) => Promise<void>;
  updateAssignmentNote: (courseId: string, assignmentId: string, note: string) => Promise<void>;
};



const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "setData":
      return { ...state, user: action.payload.user, courses: action.payload.courses, isLoading: false, error: undefined };
    case "setUser":
      return { ...state, user: action.payload };
    case "setLoading":
      return { ...state, isLoading: action.payload };
    case "setError":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const AppStateContext = createContext<ContextValue | null>(null);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    courses: [],
    isLoading: true
  });

  const refresh = useCallback(async () => {
    dispatch({ type: "setLoading", payload: true });
    dispatch({ type: "setError", payload: undefined });
    try {
      const [user, courses] = await Promise.all([
        apiClient.getCurrentUser(),
        apiClient.getCourses()
      ]);
      dispatch({ type: "setData", payload: { user, courses } });
    } catch (error) {
      dispatch({ type: "setError", payload: toMessage(error) });
      dispatch({ type: "setLoading", payload: false });
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const safe = useCallback(
    async (run: () => Promise<void>) => {
      dispatch({ type: "setError", payload: undefined });
      try {
        await run();
      } catch (error) {
        dispatch({ type: "setError", payload: toMessage(error) });
      }
    },
    []
  );

  const setDisplayName = useCallback(
    (name: string) =>
      safe(async () => {
        const user = await apiClient.updateProfile({ displayName: name });
        dispatch({ type: "setUser", payload: user });
      }),
    [safe]
  );

  const setFocusCourse = useCallback(
    (courseId?: string | null) =>
      safe(async () => {
        const user = await apiClient.setFocusCourse(courseId ?? null);
        dispatch({ type: "setUser", payload: user });
      }),
    [safe]
  );

  const addCourse = useCallback(
    (course: NewCoursePayload) =>
      safe(async () => {
        await apiClient.createCourse(course);
        await refresh();
      }),
    [safe, refresh]
  );

  const updateCourse = useCallback(
    (courseId: string, data: UpdateCoursePayload) =>
      safe(async () => {
        await apiClient.updateCourse(courseId, data);
        await refresh();
      }),
    [safe, refresh]
  );

  const updateCourseNotes = useCallback(
    (courseId: string, notes: string) => updateCourse(courseId, { notes }),
    [updateCourse]
  );

  const addLecture = useCallback(
    (courseId: string, lecture: NewLecturePayload) =>
      safe(async () => {
        await apiClient.createLecture(courseId, lecture);
        await refresh();
      }),
    [safe, refresh]
  );

  const updateLectureStatus = useCallback(
    (courseId: string, lectureId: string, status: LectureStatus) =>
      safe(async () => {
        await apiClient.updateLecture(courseId, lectureId, { status });
        await refresh();
      }),
    [safe, refresh]
  );

  const updateLectureNote = useCallback(
    (courseId: string, lectureId: string, note: string) =>
      safe(async () => {
        await apiClient.updateLecture(courseId, lectureId, { note });
        await refresh();
      }),
    [safe, refresh]
  );

  const addAssignment = useCallback(
    (courseId: string, assignment: NewAssignmentPayload) =>
      safe(async () => {
        await apiClient.createAssignment(courseId, assignment);
        await refresh();
      }),
    [safe, refresh]
  );

  const updateAssignmentStatus = useCallback(
    (courseId: string, assignmentId: string, status: AssignmentStatus) =>
      safe(async () => {
        await apiClient.updateAssignment(courseId, assignmentId, { status });
        await refresh();
      }),
    [safe, refresh]
  );

  const updateAssignmentNote = useCallback(
    (courseId: string, assignmentId: string, note: string) =>
      safe(async () => {
        await apiClient.updateAssignment(courseId, assignmentId, { note });
        await refresh();
      }),
    [safe, refresh]
  );

  const value = useMemo(
    () => ({
      state,
      refresh,
      setDisplayName,
      setFocusCourse,
      addCourse,
      updateCourse,
      updateCourseNotes,
      addLecture,
      updateLectureStatus,
      updateLectureNote,
      addAssignment,
      updateAssignmentStatus,
      updateAssignmentNote
    }),
    [
      state,
      refresh,
      setDisplayName,
      setFocusCourse,
      addCourse,
      updateCourse,
      updateCourseNotes,
      addLecture,
      updateLectureStatus,
      updateLectureNote,
      addAssignment,
      updateAssignmentStatus,
      updateAssignmentNote
    ]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = () => {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState must be used inside AppStateProvider");
  }
  return ctx;
};
