import { Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./auth/AuthContext";
import LandingPage from "./pages/LandingPage";
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
      {/* Root path - redirect based on auth status */}
      <Route path="/" element={<RootRedirect />} />
      
      {/* Public routes (no AppShell) */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected routes (with AppShell) */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AppShell>
            <DashboardPage />
          </AppShell>
        </ProtectedRoute>
      } />
      
      <Route path="/courses" element={
        <ProtectedRoute>
          <AppShell>
            <CoursesPage />
          </AppShell>
        </ProtectedRoute>
      } />
      
      <Route path="/courses/:courseId" element={
        <ProtectedRoute>
          <AppShell>
            <CourseDetailPage />
          </AppShell>
        </ProtectedRoute>
      } />
      
      <Route path="/courses/:courseId/lectures/:lectureId" element={
        <ProtectedRoute>
          <AppShell>
            <LectureDetailPage />
          </AppShell>
        </ProtectedRoute>
      } />
      
      <Route path="/assignments" element={
        <ProtectedRoute>
          <AppShell>
            <AssignmentsPage />
          </AppShell>
        </ProtectedRoute>
      } />
      
      {/* 404 page */}
      <Route path="*" element={
        <ProtectedRoute>
          <AppShell>
            <NotFoundPage />
          </AppShell>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

// Component to handle root path redirection
function RootRedirect() {
  console.log('RootRedirect component mounting...');
  
  try {
    const { isAuthenticated, isLoading } = useAuth();
    console.log('RootRedirect - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);
    
    if (isLoading) {
      console.log('RootRedirect - Showing loading spinner');
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-4">Loading authentication...</p>
        </div>
      );
    }
    
    if (isAuthenticated) {
      console.log('RootRedirect - Redirecting to dashboard');
      return <Navigate to="/dashboard" replace />;
    } else {
      console.log('RootRedirect - Redirecting to login');
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error('RootRedirect - Error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-600">
          <p>Error loading authentication</p>
          <p>Please check the console</p>
        </div>
      </div>
    );
  }
}

export default App;
