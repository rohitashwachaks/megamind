import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppState } from "../state/AppStateContext";
import { CourseCard } from "../components/CourseCard";
import { getCourseProgress, getNextLecture } from "../utils/progress";
import { StatusPill } from "../components/StatusPill";
import { ProgressBar } from "../components/ProgressBar";

const DashboardPage = () => {
  const { state, setDisplayName, setFocusCourse, refresh } = useAppState();
  const [displayName, setDisplayNameInput] = useState("");

  useEffect(() => {
    setDisplayNameInput(state.user?.displayName ?? "");
  }, [state.user?.displayName]);

  if (state.loading.isLoading) {
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
      <div className="card">
        <p style={{ margin: "0 0 8px 0" }}>Failed to load data: {state.error}</p>
        <button type="button" onClick={refresh}>
          Retry
        </button>
      </div>
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
      <div className="section-header">
        <div>
          <h1 className="page-title">Hi, {state.user?.displayName || "Learner"}</h1>
          <p className="muted">Let&apos;s make some progress today.</p>
        </div>
        <div style={{ minWidth: 220 }}>
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
          />
        </div>
      </div>

      {focusCourse ? (
        <section className="card" style={{ marginBottom: 14 }}>
          <div className="section-header">
            <div>
              <p className="subtle" style={{ margin: 0 }}>
                Next up
              </p>
              <h2 style={{ margin: "4px 0 6px" }}>{focusCourse.title}</h2>
            </div>
            <StatusPill status={focusCourse.status} />
          </div>
          {nextLecture ? (
            <>
              <p style={{ margin: "0 0 6px 0" }}>
                Continue with <strong>{nextLecture.title}</strong>
              </p>
              <div className="inline-actions" style={{ marginTop: 8 }}>
                <Link className="button" to={`/courses/${focusCourse.id}/lectures/${nextLecture.id}`}>
                  Resume
                </Link>
                <Link className="button secondary" to={`/courses/${focusCourse.id}`}>
                  Open course
                </Link>
              </div>
            </>
          ) : (
            <p className="subtle" style={{ margin: 0 }}>
              All lectures completed for this course.
            </p>
          )}
          <div style={{ marginTop: 12 }}>
            <ProgressBar ratio={getCourseProgress(focusCourse).ratio} />
          </div>
        </section>
      ) : null}

      <section>
        <div className="section-header">
          <h3 style={{ margin: 0 }}>Active courses</h3>
          <Link to="/courses" className="subtle">
            View all
          </Link>
        </div>
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
      </section>

      <section style={{ marginTop: 18 }}>
        <div className="section-header">
          <h3 style={{ margin: 0 }}>Assignments snapshot</h3>
          <Link to="/assignments" className="subtle">
            Manage
          </Link>
        </div>
        {pendingAssignments.length === 0 ? (
          <div className="card">
            <p style={{ margin: 0 }}>No pending assignments right now.</p>
          </div>
        ) : (
          <div className="grid">
            {pendingAssignments.slice(0, 4).map((assignment) => (
              <div className="card" key={assignment.id}>
                <p style={{ margin: "0 0 6px 0" }}>
                  <strong>{assignment.title}</strong>
                </p>
                <p className="subtle" style={{ margin: 0 }}>
                  {assignment.courseTitle}
                </p>
                <p className="subtle" style={{ margin: "6px 0 0" }}>
                  Status: {assignment.status.replace("_", " ")}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default DashboardPage;
