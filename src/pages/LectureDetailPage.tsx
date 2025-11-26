import { useParams, Link } from "react-router-dom";
import { useAppState } from "../state/AppStateContext";
import { LectureStatus } from "../types";

const LectureDetailPage = () => {
  const params = useParams<{ courseId: string; lectureId: string }>();
  const { state, updateLectureStatus, updateLectureNote } = useAppState();

  const course = state.courses.find((item) => item.id === params.courseId);
  const lecture = course?.lectures.find((item) => item.id === params.lectureId);

  if (!course || !lecture) {
    return (
      <div>
        <h1 className="page-title">Lecture not found</h1>
        <Link to="/courses" className="subtle">
          Back to courses
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="section-header">
        <div>
          <h1 className="page-title">{lecture.title}</h1>
          <p className="muted">{course.title}</p>
        </div>
        <Link to={`/courses/${course.id}`} className="subtle">
          Back to course
        </Link>
      </div>

      <section className="card" style={{ marginBottom: 16 }}>
        <div className="section-header">
          <div>
            <p className="subtle" style={{ margin: 0 }}>
              Video
            </p>
            <a href={lecture.videoUrl} target="_blank" rel="noreferrer">
              Open video
            </a>
          </div>
          <select
            value={lecture.status}
            onChange={(event) =>
              updateLectureStatus(course.id, lecture.id, event.target.value as LectureStatus)
            }
          >
            <option value="not_started">Not started</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </section>

      <section className="card">
        <h3 style={{ margin: "0 0 10px" }}>Notes</h3>
        <textarea
          value={lecture.note || ""}
          onChange={(event) => updateLectureNote(course.id, lecture.id, event.target.value)}
          placeholder="What did you learn? Any questions to revisit?"
        />
      </section>
    </>
  );
};

export default LectureDetailPage;
