import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppState } from "../state/AppStateContext";
import { CourseCard } from "../components/CourseCard";
import { getCourseProgress, getNextLecture } from "../utils/progress";
import { StatusPill } from "../components/StatusPill";
import { ProgressBar } from "../components/ProgressBar";
import { LoadingSkeleton } from "../components/LoadingSpinner";
import { ErrorState } from "../components/ErrorState";
import { EmptyState } from "../components/EmptyState";

const DashboardPage = () => {
  const { state, setDisplayName, setFocusCourse, refresh } = useAppState();
  const [displayName, setDisplayNameInput] = useState("");

  useEffect(() => {
    setDisplayNameInput(state.user?.displayName ?? "");
  }, [state.user?.displayName]);

  if (state.isLoading) {
    return (
      <div>
        <div className="mb-6">
          <div className="skeleton-line skeleton-line-title mb-2" style={{ width: '200px' }} />
          <div className="skeleton-line skeleton-line-subtitle" style={{ width: '300px' }} />
        </div>
        <LoadingSkeleton count={3} />
      </div>
    );
  }

  if (state.error) {
    return (
      <ErrorState
        title="Unable to load dashboard"
        message="We couldn't load your courses and assignments. Please check your connection and try again."
        onRetry={refresh}
      />
    );
  }

  const activeCourses = state.courses.filter((course) => course.status !== "completed");
  const focusCourse =
    state.courses.find((course) => course.id === state.user?.focusCourseId) ||
    activeCourses[0] ||
    state.courses[0];
  const nextLecture = focusCourse ? getNextLecture(focusCourse) : undefined;

  const assignments = state.courses.flatMap((course) =>
    course.assignments.map((assignment) => ({
      ...assignment,
      courseTitle: course.title
    }))
  );

  const pendingAssignments = assignments.filter(
    (assignment) => assignment.status === "not_started" || assignment.status === "in_progress"
  );

  return (
    <>
      <div className="section-header mb-4">
        <div>
          <h1 className="page-title m-0 mb-2">Hi, {state.user?.displayName || "Learner"} 👋</h1>
          <p className="muted m-0">Let&apos;s make some progress today.</p>
        </div>
        <div className="name-input-wrapper">
          <label htmlFor="displayName">Display name</label>
          <input
            id="displayName"
            value={displayName}
            onChange={(event) => setDisplayNameInput(event.target.value)}
            onBlur={() => {
              if (displayName !== state.user?.displayName) {
                setDisplayName(displayName);
              }
            }}
            placeholder="Add your name"
            aria-label="Update your display name"
          />
        </div>
      </div>

      {focusCourse ? (
        <section className="card focus-card mb-4" aria-labelledby="focus-course-title">
          <div className="section-header mb-3">
            <div>
              <p className="subtle m-0 mb-1">🎯 Next up</p>
              <h2 id="focus-course-title" className="m-0 mb-1">{focusCourse.title}</h2>
            </div>
            <StatusPill status={focusCourse.status} />
          </div>
          {nextLecture ? (
            <>
              <p className="m-0 mb-2">
                Continue with <strong>{nextLecture.title}</strong>
              </p>
              <div className="inline-actions mt-2">
                <Link 
                  className="button" 
                  to={`/courses/${focusCourse.id}/lectures/${nextLecture.id}`}
                  aria-label={`Resume ${nextLecture.title}`}
                >
                  ▶ Resume
                </Link>
                <Link 
                  className="button secondary" 
                  to={`/courses/${focusCourse.id}`}
                  aria-label={`View all lectures for ${focusCourse.title}`}
                >
                  View Course
                </Link>
              </div>
            </>
          ) : (
            <p className="subtle m-0">
              ✓ All lectures completed for this course!
            </p>
          )}
          <div className="mt-3">
            <ProgressBar 
              ratio={getCourseProgress(focusCourse).ratio} 
              label={`${focusCourse.title} progress`}
              showPercentage
            />
          </div>
        </section>
      ) : (
        <EmptyState
          icon="🎯"
          title="No focus course set"
          description="Choose a course to focus on and track your progress more effectively."
          actionLabel="Browse Courses"
          actionLink="/courses"
        />
      )}

      <section className="mb-6">
        <div className="section-header mb-3">
          <h3 className="m-0">📚 Active Courses</h3>
          <Link to="/courses" className="subtle" aria-label="View all courses">
            View all →
          </Link>
        </div>
        {state.courses.length === 0 ? (
          <EmptyState
            icon="📚"
            title="No courses yet"
            description="Start your learning journey by adding your first course."
            actionLabel="Add Course"
            actionLink="/courses"
          />
        ) : (
          <div className="grid columns-2">
            {state.courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isFocus={course.id === focusCourse?.id}
                onFocus={(courseId) => setFocusCourse(courseId)}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="section-header mb-3">
          <h3 className="m-0">📝 Assignments Snapshot</h3>
          <Link to="/assignments" className="subtle" aria-label="Manage all assignments">
            Manage →
          </Link>
        </div>
        {pendingAssignments.length === 0 ? (
          <div className="card">
            <p className="m-0 text-center">✨ No pending assignments right now. Great job!</p>
          </div>
        ) : (
          <div className="grid">
            {pendingAssignments.slice(0, 4).map((assignment) => (
              <div className="card assignment-card" key={assignment.id}>
                <p className="m-0 mb-2 text-semibold">{assignment.title}</p>
                <p className="subtle m-0 mb-1">{assignment.courseTitle}</p>
                <StatusPill 
                  status={assignment.status as any} 
                  label={assignment.status.replace("_", " ")}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default DashboardPage;
