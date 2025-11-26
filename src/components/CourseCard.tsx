import { Link } from "react-router-dom";
import { Course } from "../types";
import { getCourseProgress, getNextLecture } from "../utils/progress";
import { ProgressBar } from "./ProgressBar";
import { StatusPill } from "./StatusPill";

type Props = {
  course: Course;
  isFocus?: boolean;
  onFocus?: (courseId: string) => void;
};

export const CourseCard = ({ course, onFocus, isFocus }: Props) => {
  const progress = getCourseProgress(course);
  const nextLecture = getNextLecture(course);

  return (
    <article className="card">
      <div className="section-header">
        <div>
          <h3 style={{ margin: "0 0 4px 0" }}>{course.title}</h3>
          <p className="subtle" style={{ margin: 0 }}>
            {course.description}
          </p>
        </div>
        <div className="pill-group">
          <StatusPill status={course.status} />
          {isFocus ? <span className="chip">Focus</span> : null}
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <ProgressBar ratio={progress.ratio} />
        <p className="subtle" style={{ margin: "6px 0 0" }}>
          {progress.completed}/{progress.totalLectures} lectures complete
        </p>
      </div>

      {nextLecture ? (
        <p style={{ margin: "6px 0" }}>
          Next up: <strong>{nextLecture.title}</strong>
        </p>
      ) : (
        <p className="subtle" style={{ margin: "6px 0" }}>
          All lectures completed.
        </p>
      )}

      <div className="inline-actions" style={{ marginTop: 10 }}>
        <Link className="button" to={`/courses/${course.id}`}>
          Open
        </Link>
        <a className="button secondary" href={course.source} target="_blank" rel="noreferrer">
          Source
        </a>
        {onFocus ? (
          <button
            type="button"
            className="secondary"
            onClick={() => onFocus(course.id)}
            aria-label="Set focus course"
          >
            {isFocus ? "Focused" : "Set focus"}
          </button>
        ) : null}
      </div>
    </article>
  );
};
