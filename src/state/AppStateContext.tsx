import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer
} from "react";
import { useLocation } from "react-router-dom";
import { apiClient, toMessage } from "../api/client";
import {
    AppState,
    Assignment,
    AssignmentStatus,
    Course,
    Lecture,
    LectureStatus, LoadingState,
    NewAssignmentPayload,
    NewCoursePayload,
    NewLecturePayload,
    UpdateAssignmentPayload,
    UpdateCoursePayload,
    UpdateLecturePayload,
    User
} from "../types";

type Action =
  | { type: "SET_DATA"; payload: { user: User; courses: Course[] } }
  | { type: "SET_USER"; payload: User }
  | { type: "SET_LOADING"; payload: LoadingState }
  | { type: "SET_ERROR"; payload?: string }
  | { type: "ADD_COURSE"; payload: Course }
  | { type: "UPDATE_COURSE"; payload: Course }
  | { type: "DELETE_COURSE"; payload: string }
  | { type: "ADD_LECTURE"; payload: { courseId: string; lecture: Lecture } }
  | { type: "UPDATE_LECTURE"; payload: { courseId: string; lecture: Lecture } }
  | { type: "DELETE_LECTURE"; payload: { courseId: string; lectureId: string } }
  | { type: "ADD_ASSIGNMENT"; payload: { courseId: string; assignment: Assignment } }
  | { type: "UPDATE_ASSIGNMENT"; payload: { courseId: string; assignment: Assignment } }
  | { type: "DELETE_ASSIGNMENT"; payload: { courseId: string; assignmentId: string } };

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
  deleteCourse: (courseId: string) => Promise<void>;
  deleteLecture: (courseId: string, lectureId: string) => Promise<void>;
  deleteAssignment: (courseId: string, assignmentId: string) => Promise<void>;
};



const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "SET_DATA":
      return { ...state, user: action.payload.user, courses: action.payload.courses, loading: { isLoading: false }, error: undefined };
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "ADD_COURSE":
      return { ...state, courses: [...state.courses, action.payload] };
    case "UPDATE_COURSE":
      return {
        ...state,
        courses: state.courses.map((c) => (c.id === action.payload.id ? action.payload : c))
      };
    case "DELETE_COURSE":
      return { ...state, courses: state.courses.filter((c) => c.id !== action.payload) };
    case "ADD_LECTURE":
    case "UPDATE_LECTURE":
    case "DELETE_LECTURE":
    case "ADD_ASSIGNMENT":
    case "UPDATE_ASSIGNMENT":
    case "DELETE_ASSIGNMENT":
      return {
        ...state,
        courses: state.courses.map((course) => {
          if (course.id !== action.payload.courseId) return course;

          let lectures = course.lectures;
          if (action.type === "ADD_LECTURE") {
            lectures = [...lectures, action.payload.lecture];
          } else if (action.type === "UPDATE_LECTURE") {
            lectures = lectures.map((l) => (l.id === action.payload.lecture.id ? action.payload.lecture : l));
          } else if (action.type === "DELETE_LECTURE") {
            lectures = lectures.filter((l) => l.id !== action.payload.lectureId);
          }

          let assignments = course.assignments;
          if (action.type === "ADD_ASSIGNMENT") {
            assignments = [...assignments, action.payload.assignment];
          } else if (action.type === "UPDATE_ASSIGNMENT") {
            assignments = assignments.map((a) => (a.id === action.payload.assignment.id ? action.payload.assignment : a));
          } else if (action.type === "DELETE_ASSIGNMENT") {
            assignments = assignments.filter((a) => a.id !== action.payload.assignmentId);
          }

          return { ...course, lectures, assignments };
        })
      };
    default:
      return state;
  }
};

const AppStateContext = createContext<ContextValue | null>(null);

/**
 * Provides the application state and actions to its children.
 */
export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    courses: [],
    loading: { isLoading: true }
  });

  /**
   * Fetches the initial data from the API and populates the state.
   */
  const refresh = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: { isLoading: true } });
    dispatch({ type: "SET_ERROR", payload: undefined });
    try {
      const [user, courses] = await Promise.all([
        apiClient.getCurrentUser(),
        apiClient.getCourses()
      ]);
      dispatch({ type: "SET_DATA", payload: { user, courses } });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: toMessage(error) });
      dispatch({ type: "SET_LOADING", payload: { isLoading: false } });
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]); // Run only once on initial load

  /**
   * A wrapper around API calls to handle errors and loading states.
   */
  const safe = useCallback(
    async (run: () => Promise<void>, action?: string, message?: string) => {
      dispatch({ type: "SET_LOADING", payload: { isLoading: true, action, message } });
      dispatch({ type: "SET_ERROR", payload: undefined });
      try {
        await run();
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: toMessage(error) });
      }
      dispatch({ type: "SET_LOADING", payload: { isLoading: false } });
    },
    []
  );

  const setDisplayName = useCallback(
    (name: string) =>
      safe(
        async () => {
          const user = await apiClient.updateProfile({ displayName: name });
          dispatch({ type: "SET_USER", payload: user });
        },
        "setDisplayName",
        "Updating profile..."
      ),
    [safe]
  );

  const setFocusCourse = useCallback(
    (courseId?: string | null) =>
      safe(
        async () => {
          const user = await apiClient.setFocusCourse(courseId ?? null);
          dispatch({ type: "SET_USER", payload: user });
        },
        "setFocusCourse",
        "Setting focus course..."
      ),
    [safe]
  );

  const addCourse = useCallback(
    (course: NewCoursePayload) =>
      safe(
        async () => {
          const newCourse = await apiClient.createCourse(course);
          dispatch({ type: "ADD_COURSE", payload: newCourse });
        },
        "addCourse",
        "Adding course..."
      ),
    [safe]
  );

  const updateCourse = useCallback(
    (courseId: string, data: UpdateCoursePayload) =>
      safe(
        async () => {
          const updatedCourse = await apiClient.updateCourse(courseId, data);
          dispatch({ type: "UPDATE_COURSE", payload: updatedCourse });
        },
        "updateCourse",
        "Updating course..."
      ),
    [safe]
  );

  const updateCourseNotes = useCallback(
    (courseId: string, notes: string) => updateCourse(courseId, { notes }),
    [updateCourse]
  );

  const deleteCourse = useCallback(
    (courseId: string) =>
      safe(
        async () => {
          await apiClient.deleteCourse(courseId);
          dispatch({ type: "DELETE_COURSE", payload: courseId });
        },
        "deleteCourse",
        "Deleting course..."
      ),
    [safe]
  );

  const addLecture = useCallback(
    (courseId: string, lecture: NewLecturePayload) =>
      safe(
        async () => {
          const newLecture = await apiClient.createLecture(courseId, lecture);
          dispatch({ type: "ADD_LECTURE", payload: { courseId, lecture: newLecture } });
        },
        "addLecture",
        "Adding lecture..."
      ),
    [safe]
  );

  const updateLectureStatus = useCallback(
    (courseId: string, lectureId: string, status: LectureStatus) =>
      safe(
        async () => {
          const updatedLecture = await apiClient.updateLecture(courseId, lectureId, { status });
          dispatch({ type: "UPDATE_LECTURE", payload: { courseId, lecture: updatedLecture } });
        },
        "updateLectureStatus",
        "Updating lecture..."
      ),
    [safe]
  );

  const updateLectureNote = useCallback(
    (courseId: string, lectureId: string, note: string) =>
      safe(
        async () => {
          const updatedLecture = await apiClient.updateLecture(courseId, lectureId, { note });
          dispatch({ type: "UPDATE_LECTURE", payload: { courseId, lecture: updatedLecture } });
        },
        "updateLectureNote",
        "Updating lecture note..."
      ),
    [safe]
  );

  const deleteLecture = useCallback(
    (courseId: string, lectureId: string) =>
      safe(
        async () => {
          await apiClient.deleteLecture(courseId, lectureId);
          dispatch({ type: "DELETE_LECTURE", payload: { courseId, lectureId } });
        },
        "deleteLecture",
        "Deleting lecture..."
      ),
    [safe]
  );

  const addAssignment = useCallback(
    (courseId: string, assignment: NewAssignmentPayload) =>
      safe(
        async () => {
          const newAssignment = await apiClient.createAssignment(courseId, assignment);
          dispatch({ type: "ADD_ASSIGNMENT", payload: { courseId, assignment: newAssignment } });
        },
        "addAssignment",
        "Adding assignment..."
      ),
    [safe]
  );

  const updateAssignmentStatus = useCallback(
    (courseId: string, assignmentId: string, status: AssignmentStatus) =>
      safe(
        async () => {
          const updatedAssignment = await apiClient.updateAssignment(courseId, assignmentId, { status });
          dispatch({ type: "UPDATE_ASSIGNMENT", payload: { courseId, assignment: updatedAssignment } });
        },
        "updateAssignmentStatus",
        "Updating assignment..."
      ),
    [safe]
  );

  const updateAssignmentNote = useCallback(
    (courseId: string, assignmentId: string, note: string) =>
      safe(
        async () => {
          const updatedAssignment = await apiClient.updateAssignment(courseId, assignmentId, { note });
          dispatch({ type: "UPDATE_ASSIGNMENT", payload: { courseId, assignment: updatedAssignment } });
        },
        "updateAssignmentNote",
        "Updating assignment note..."
      ),
    [safe]
  );

  const deleteAssignment = useCallback(
    (courseId: string, assignmentId: string) =>
      safe(
        async () => {
          await apiClient.deleteAssignment(courseId, assignmentId);
          dispatch({ type: "DELETE_ASSIGNMENT", payload: { courseId, assignmentId } });
        },
        "deleteAssignment",
        "Deleting assignment..."
      ),
    [safe]
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
      deleteCourse,
      addLecture,
      updateLectureStatus,
      updateLectureNote,
      deleteLecture,
      addAssignment,
      updateAssignmentStatus,
      updateAssignmentNote,
      deleteAssignment
    }),
    [
      state,
      refresh,
      setDisplayName,
      setFocusCourse,
      addCourse,
      updateCourse,
      updateCourseNotes,
      deleteCourse,
      addLecture,
      updateLectureStatus,
      updateLectureNote,
      deleteLecture,
      addAssignment,
      updateAssignmentStatus,
      updateAssignmentNote,
      deleteAssignment
    ]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

/**
 * A hook to access the application state and actions.
 */
export const useAppState = () => {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState must be used inside AppStateProvider");
  }
  return ctx;
};
