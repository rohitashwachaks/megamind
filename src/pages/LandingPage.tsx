import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiClient } from "../api/client";
import { Course } from "../types";
import { useAuth } from "../auth/AuthContext";
import { LoadingSkeleton } from "../components/LoadingSpinner";
import { ErrorState } from "../components/ErrorState";
import "./LandingPage.css";

/**
 * LandingPage - Public page showing course catalog
 * 
 * Features:
 * - Shows all available courses (public catalog)
 * - No authentication required
 * - Prompts users to login/register for personalized features
 * - If already logged in, redirects to dashboard
 */
const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated)
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch courses from public API (no auth required)
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getCourses(); // No token = public catalog
        setCourses(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="landing-page">
        <div className="landing-header">
          <div className="skeleton-line skeleton-line-title" style={{ width: '250px' }} />
          <div className="skeleton-line skeleton-line-subtitle" style={{ width: '400px' }} />
        </div>
        <LoadingSkeleton count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="landing-page">
        <ErrorState
          title="Unable to load courses"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-content">
          <h1 className="page-title">Welcome to PocketSchool 🎓</h1>
          <p className="hero-subtitle">
            Your personal MIT OCW companion. Track progress, take notes, and stay organized
            while learning from world-class courses.
          </p>

          {isAuthenticated ? (
              <div className="hero-actions">
                  <Link to="/dashboard" className="button primary-button">
                      Get Started →
                  </Link>
              </div>
          ) : (
              <div className="hero-actions">
                  <Link to="/login" className="button primary-button">
                      Go to Dashboard →
                  </Link>
                  <Link to="/login" className="button secondary-button">
                      Login
                  </Link>
              </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      {!isAuthenticated && (
        <section className="landing-features card mb-4">
          <h2 className="section-title mb-3">Why PocketSchool?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">📚</div>
              <h3>Track Your Progress</h3>
              <p>Mark lectures as complete, track assignments, and see your learning journey</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✍️</div>
              <h3>Take Notes</h3>
              <p>Add personal notes to lectures and courses for better retention</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <h3>Stay Focused</h3>
              <p>Set a focus course and get reminders for what to study next</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">☁️</div>
              <h3>Sync Everywhere</h3>
              <p>Access your data from any device with cloud synchronization</p>
            </div>
          </div>
        </section>
      )}

      {/* Courses Section */}
      <section className="landing-courses">
        <div className="section-header mb-4">
          <h2>Browse Courses</h2>
          {!isAuthenticated && (
            <p className="subtle">Login to track your progress and add notes</p>
          )}
        </div>

        {courses.length === 0 ? (
          <div className="card text-center">
            <p className="m-0">No courses available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid columns-2">
            {courses.map((course) => (
              <div key={course.id} className="card course-preview-card">
                <div className="mb-3">
                  <h3 className="m-0 mb-2">{course.title}</h3>
                  <p className="subtle m-0 mb-2">{course.description}</p>
                  {course.tags && course.tags.length > 0 && (
                    <div className="tags">
                      {course.tags.map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="course-meta mb-3">
                  <span className="meta-item">
                    📹 {course.lectures?.length || 0} lectures
                  </span>
                  <span className="meta-item">
                    📝 {course.assignments?.length || 0} assignments
                  </span>
                </div>

                {!isAuthenticated ? (
                  <Link to="/login" className="button w-full">
                    Login to Enroll →
                  </Link>
                ) : (
                  <Link to={`/courses/${course.id}`} className="button w-full">
                    View Course →
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="landing-cta card mt-6">
          <div className="cta-content">
            <h2>Ready to start learning?</h2>
            <p className="mb-4">
              Create a free account to track your progress, take notes, and make the most of your MIT OCW experience.
            </p>
            <Link to="/login" className="button primary-button">
              Create Free Account →
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="landing-footer mt-6">
        <p className="subtle text-center m-0">
          PocketSchool is an independent companion app for MIT OpenCourseWare.
          <br />
          All course content belongs to MIT and is licensed under Creative Commons.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
