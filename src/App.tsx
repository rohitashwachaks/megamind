import { Routes, Route } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import DashboardPage from "./pages/DashboardPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import LectureDetailPage from "./pages/LectureDetailPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  return (
    <Routes>
      {/* Public routes (no AppShell) */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected routes (with AppShell) */}
      <Route path="/*" element={
        <AppShell>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:courseId" element={<CourseDetailPage />} />
            <Route path="/courses/:courseId/lectures/:lectureId" element={<LectureDetailPage />} />
            <Route path="/assignments" element={<AssignmentsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppShell>
      } />
    </Routes>
  );
};

export default App;
