import { useState } from "react";
import { useAppState } from "../state/AppStateContext";
import { AssignmentStatus } from "../types";
import { Link } from "react-router-dom";

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
    return <p>Loading assignments...</p>;
  }

  if (state.error) {
    return (
      <div className="card">
        <p style={{ margin: "0 0 8px 0" }}>Failed to load assignments: {state.error}</p>
        <button type="button" onClick={refresh}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="section-header">
        <div>
          <h1 className="page-title">Assignments</h1>
          <p className="muted">Keep lightweight tabs on what is pending across courses.</p>
        </div>
        <Link to="/" className="subtle">
          Back to dashboard
        </Link>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <label htmlFor="statusFilter">Filter by status</label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as AssignmentStatus | "all")}
        >
          <option value="all">All</option>
          <option value="not_started">Not started</option>
          <option value="in_progress">In progress</option>
          <option value="submitted">Submitted</option>
          <option value="skipped">Skipped</option>
        </select>
      </div>

      <div className="list">
        {filtered.map((assignment) => (
          <div className="list-item" key={assignment.id}>
            <div className="section-header">
              <div>
                <p style={{ margin: "0 0 4px 0", fontWeight: 600 }}>{assignment.title}</p>
                <p className="subtle" style={{ margin: 0 }}>
                  {assignment.courseTitle}
                </p>
                {assignment.link ? (
                  <a href={assignment.link} target="_blank" rel="noreferrer" className="subtle">
                    Open resource
                  </a>
                ) : null}
                {assignment.dueDate ? (
                  <p className="subtle" style={{ margin: "4px 0 0" }}>
                    Due: {assignment.dueDate}
                  </p>
                ) : null}
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
              >
                <option value="not_started">Not started</option>
                <option value="in_progress">In progress</option>
                <option value="submitted">Submitted</option>
                <option value="skipped">Skipped</option>
              </select>
            </div>
            <textarea
              value={assignment.note || ""}
              onChange={(event) =>
                updateAssignmentNote(assignment.courseId, assignment.id, event.target.value)
              }
              placeholder="Reflection or submission link"
            />
          </div>
        ))}
        {filtered.length === 0 ? (
          <div className="card">
            <p style={{ margin: 0 }}>Nothing here yet.</p>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default AssignmentsPage;
