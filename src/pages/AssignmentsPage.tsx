import { useState } from "react";
import { useAppState } from "../state/AppStateContext";
import { AssignmentStatus } from "../types";
import { Link } from "react-router-dom";
import { LoadingSkeleton } from "../components/LoadingSpinner";
import { ErrorState } from "../components/ErrorState";
import { EmptyState } from "../components/EmptyState";
import { StatusPill } from "../components/StatusPill";

const AssignmentsPage = () => {
  const { state, updateAssignmentStatus, updateAssignmentNote, refresh } = useAppState();
  const [statusFilter, setStatusFilter] = useState<AssignmentStatus | "all">("all");

  const assignments = state.courses.flatMap((course) =>
    course.assignments.map((assignment) => ({
      ...assignment,
      courseId: course.id,
      courseTitle: course.title
    }))
  );

  const filtered =
    statusFilter === "all"
      ? assignments
      : assignments.filter((assignment) => assignment.status === statusFilter);

  if (state.loading.isLoading) {
    return (
      <div>
        <div className="mb-4">
          <div className="skeleton-line skeleton-line-title mb-2" style={{ width: '180px' }} />
          <div className="skeleton-line skeleton-line-subtitle" style={{ width: '320px' }} />
        </div>
        <LoadingSkeleton count={4} />
      </div>
    );
  }

  if (state.error) {
    return (
      <ErrorState
        title="Unable to load assignments"
        message="We couldn't load your assignments. Please check your connection and try again."
        onRetry={refresh}
      />
    );
  }

  return (
    <>
      <div className="section-header mb-4">
        <div>
          <h1 className="page-title m-0 mb-2">📝 Assignments</h1>
          <p className="muted m-0">Keep lightweight tabs on what is pending across courses.</p>
        </div>
        <Link to="/" className="subtle" aria-label="Back to dashboard">
          ← Back
        </Link>
      </div>

      <div className="card mb-4">
        <label htmlFor="statusFilter">🔍 Filter by Status</label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as AssignmentStatus | "all")}
          aria-label="Filter assignments by status"
        >
          <option value="all">All Assignments ({assignments.length})</option>
          <option value="not_started">Not Started</option>
          <option value="in_progress">In Progress</option>
          <option value="submitted">Submitted</option>
          <option value="skipped">Skipped</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="✨"
          title={statusFilter === "all" ? "No assignments yet" : `No ${statusFilter.replace("_", " ")} assignments`}
          description={statusFilter === "all" ? "Assignments from your courses will appear here as you add them." : "Try selecting a different filter to view other assignments."}
          actionLabel="View Courses"
          actionLink="/courses"
        />
      ) : (
        <div className="list">
          {filtered.map((assignment) => (
            <div className="list-item assignment-item" key={assignment.id}>
              <div className="section-header mb-3">
                <div>
                  <p className="m-0 mb-1 text-semibold">{assignment.title}</p>
                  <p className="subtle m-0 mb-2">{assignment.courseTitle}</p>
                  {assignment.link && (
                    <a 
                      href={assignment.link} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="subtle"
                      aria-label={`Open resource for ${assignment.title} in new tab`}
                    >
                      🔗 Open Resource →
                    </a>
                  )}
                  {assignment.dueDate && (
                    <p className="subtle m-0 mt-1">
                      📅 Due: {assignment.dueDate}
                    </p>
                  )}
                </div>
                <select
                  value={assignment.status}
                  onChange={(event) =>
                    updateAssignmentStatus(
                      assignment.courseId,
                      assignment.id,
                      event.target.value as AssignmentStatus
                    )
                  }
                  aria-label={`Update status for ${assignment.title}`}
                  className="assignment-status-select"
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="submitted">Submitted</option>
                  <option value="skipped">Skipped</option>
                </select>
              </div>
              <div>
                <label htmlFor={`note-${assignment.id}`} className="subtle">
                  Notes & Reflection
                </label>
                <textarea
                  id={`note-${assignment.id}`}
                  value={assignment.note || ""}
                  onChange={(event) =>
                    updateAssignmentNote(assignment.courseId, assignment.id, event.target.value)
                  }
                  placeholder="Add notes, reflections, or submission links..."
                  aria-label={`Notes for ${assignment.title}`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AssignmentsPage;
