import { FormEvent, useEffect, useMemo, useState } from "react";
import { apiClient } from "@/api/client";
import { Link, useParams } from "react-router-dom";
import { useAppState } from "@/state/AppStateContext";
import { getCourseProgress } from "@/utils/progress";
import { StatusPill } from "@/components/StatusPill";
import { ProgressBar } from "@/components/ProgressBar";
import { AssignmentStatus, CourseStatus, LectureStatus } from "@/types";

const statusLabels: Record<CourseStatus, string> = {
  active: "In progress",
  completed: "Completed",
  parked: "Parked"
};

/**
 * Renders the detail page for a single course.
 * It displays the course information, lectures, and assignments.
 * It also allows the user to update the course status, add new lectures and assignments,
 * and delete existing lectures and assignments.
 */
const CourseDetailPage = () => {
  const params = useParams<{ courseId: string }>();
  const {
    deleteLecture,
    deleteAssignment,
    state,
    updateCourse,
    updateLectureStatus,
    addLecture,
    updateCourseNotes,
    addAssignment,
    updateAssignmentStatus
  } = useAppState();
  const [course, setCourse] = useState(state.courses.find((item) => item.id === params.courseId));

  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureUrl, setLectureUrl] = useState("");
  const [lectureOrder, setLectureOrder] = useState<number>(course?.lectures.length || 1);

  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentLink, setAssignmentLink] = useState("");
  const [assignmentDueDate, setAssignmentDueDate] = useState("");
  const [notesDraft, setNotesDraft] = useState(course?.notes ?? "");

  const progress = course ? getCourseProgress(course) : null;
  const sortedLectures = useMemo(
    () => (course ? [...course.lectures].sort((a, b) => a.order - b.order) : []),
    [course]
  );

  /**
   * Fetches the course details from the API when the component mounts or the course ID changes.
   */
  useEffect(() => {
    if (params.courseId) {
      apiClient.getCourse(params.courseId).then(course => {
        setCourse(course);
        setNotesDraft(course.notes);
      });
    }
  }, [params.courseId]);

  useEffect(() => {
    if (course) {
      setLectureOrder((course.lectures.length || 0) + 1);
    }
  }, [course?.id, course?.lectures.length]);

  if (state.isLoading) {
    return <p>Loading course...</p>;
  }

  if (state.error) {
    return (
      <div className="card">
        <p style={{ margin: 0 }}>Failed to load course: {state.error}</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div>
        <h1 className="page-title">Course not found</h1>
        <Link to="/courses" className="subtle">
          Back to courses
        </Link>
      </div>
    );
  }

  const handleAddLecture = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!lectureTitle.trim() || !lectureUrl.trim()) return;
    await addLecture(course.id, {
      title: lectureTitle.trim(),
      videoUrl: lectureUrl.trim(),
      order: lectureOrder || course.lectures.length + 1
    });
    setLectureTitle("");
    setLectureUrl("");
    setLectureOrder((value) => value + 1);
  };

  const handleAddAssignment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!assignmentTitle.trim()) return;
    await addAssignment(course.id, {
      title: assignmentTitle.trim(),
      dueDate: assignmentDueDate || undefined,
      link: assignmentLink.trim(),
      note: ""
    });
    setAssignmentTitle("");
    setAssignmentLink("");
    setAssignmentDueDate("");
  };

  return (
    <>
      <div className="section-header">
        <div>
          <h1 className="page-title">{course.title}</h1>
          <p className="muted">{course.description}</p>
          <a href={course.source} target="_blank" rel="noreferrer" className="subtle">
            View source
          </a>
        </div>
        <div style={{ minWidth: 200 }}>
          <label htmlFor="courseStatus">Status</label>
          <select
            id="courseStatus"
            value={course.status}
            onChange={async (event) =>
              updateCourse(course.id, { status: event.target.value as CourseStatus })
            }
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {progress ? (
        <div className="card" style={{ marginBottom: 14 }}>
          <div className="section-header">
            <h3 style={{ margin: 0 }}>Progress</h3>
            <StatusPill
              status={course.status === "completed" ? "completed" : "active"}
              label={statusLabels[course.status]}
            />
          </div>
          <ProgressBar ratio={progress.ratio} />
          <p className="subtle" style={{ margin: "6px 0 0" }}>
            {progress.completed}/{progress.totalLectures} lectures complete •{" "}
            {progress.inProgress} in progress
          </p>
        </div>
      ) : null}

      <section style={{ marginBottom: 16 }}>
        <div className="section-header">
          <h3 style={{ margin: 0 }}>Lectures</h3>
          <span className="subtle">{course.lectures.length} total</span>
        </div>
        <div className="list">
          {sortedLectures.map((lecture) => (
            <div className="list-item" key={lecture.id}>
              <div className="section-header">
                <div>
                  <p style={{ margin: "0 0 4px 0", fontWeight: 600 }}>
                    Lecture {lecture.order}: {lecture.title}
                  </p>
                  <div className="inline-actions">
                    <a href={lecture.videoUrl} target="_blank" rel="noreferrer" className="subtle">
                      Open video
                    </a>
                    <Link to={`/courses/${course.id}/lectures/${lecture.id}`} className="subtle">
                      Notes
                    </Link>
                    <button onClick={() => {
                      if (window.confirm('Are you sure you want to delete this lecture?')) {
                        deleteLecture(course.id, lecture.id);
                      }
                    }} className="subtle text-danger">Delete</button>
                  </div>
                </div>
                <select
                  value={lecture.status}
                  onChange={(event) =>
                    updateLectureStatus(
                      course.id,
                      lecture.id,
                      event.target.value as LectureStatus
                    )
                  }
                  aria-label="Lecture status"
                >
                  <option value="not_started">Not started</option>
                  <option value="in_progress">In progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              {lecture.note ? (
                <p className="subtle" style={{ margin: "8px 0 0" }}>
                  Note: {lecture.note}
                </p>
              ) : null}
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: 12 }}>
          <h4 style={{ margin: "0 0 10px" }}>Add lecture</h4>
          <form className="grid columns-2" onSubmit={handleAddLecture}>
            <div>
              <label htmlFor="lectureTitle">Title</label>
              <input
                id="lectureTitle"
                value={lectureTitle}
                onChange={(event) => setLectureTitle(event.target.value)}
                placeholder="Lecture title"
              />
            </div>
            <div>
              <label htmlFor="lectureOrder">Order</label>
              <input
                id="lectureOrder"
                type="number"
                min={1}
                value={lectureOrder}
                onChange={(event) => setLectureOrder(Number(event.target.value))}
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="lectureUrl">Video URL</label>
              <input
                id="lectureUrl"
                value={lectureUrl}
                onChange={(event) => setLectureUrl(event.target.value)}
                placeholder="https://ocw.mit.edu/..."
              />
            </div>
            <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end" }}>
              <button type="submit">Add lecture</button>
            </div>
          </form>
        </div>
      </section>

      <section style={{ marginBottom: 16 }}>
        <div className="section-header">
          <h3 style={{ margin: 0 }}>Assignments</h3>
          <span className="subtle">{course.assignments.length} total</span>
        </div>
        <div className="list">
          {course.assignments.map((assignment) => (
            <div className="list-item" key={assignment.id}>
              <div className="section-header">
                <div>
                  <p style={{ margin: "0 0 4px 0", fontWeight: 600 }}>{assignment.title}</p>
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
                  <button onClick={() => {
                      if (window.confirm('Are you sure you want to delete this assignment?')) {
                        deleteAssignment(course.id, assignment.id);
                      }
                    }} className="subtle text-danger">Delete</button>
                </div>
                <select
                  value={assignment.status}
                  onChange={(event) =>
                    updateAssignmentStatus(
                      course.id,
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
              {assignment.note ? (
                <p className="subtle" style={{ margin: "8px 0 0" }}>
                  {assignment.note}
                </p>
              ) : null}
            </div>
          ))}
        </div>
        <div className="card" style={{ marginTop: 12 }}>
          <h4 style={{ margin: "0 0 10px" }}>Add assignment</h4>
          <form className="grid columns-2" onSubmit={handleAddAssignment}>
            <div>
              <label htmlFor="assignmentTitle">Title</label>
              <input
                id="assignmentTitle"
                value={assignmentTitle}
                onChange={(event) => setAssignmentTitle(event.target.value)}
                placeholder="Problem set name"
              />
            </div>
            <div>
              <label htmlFor="assignmentLink">Link</label>
              <input
                id="assignmentLink"
                value={assignmentLink}
                onChange={(event) => setAssignmentLink(event.target.value)}
                placeholder="Resource URL (optional)"
              />
            </div>
            <div>
              <label htmlFor="assignmentDueDate">Due date</label>
              <input
                id="assignmentDueDate"
                type="date"
                value={assignmentDueDate}
                onChange={(event) => setAssignmentDueDate(event.target.value)}
              />
            </div>
            <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end" }}>
              <button type="submit">Add assignment</button>
            </div>
          </form>
        </div>
      </section>

      <section className="card">
        <h3 style={{ margin: "0 0 10px" }}>Course notes</h3>
        <textarea
          value={notesDraft}
          onChange={(event) => setNotesDraft(event.target.value)}
          placeholder="Add summary notes, key references, or study reminders."
          rows={5}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
          <button
            onClick={() => updateCourseNotes(course.id, notesDraft)}
            disabled={notesDraft === course.notes}
          >
            Save notes
          </button>
        </div>
      </section>
    </>
  );
};

export default CourseDetailPage;
