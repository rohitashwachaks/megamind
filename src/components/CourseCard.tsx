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
  const progressPercentage = Math.round(progress.ratio * 100);

  return (
    <article className="card course-card" aria-labelledby={`course-title-${course.id}`}>
      <div className="section-header">
        <div className="flex-1">
          <h3 id={`course-title-${course.id}`} className="course-title m-0 mb-1">
            {course.title}
          </h3>
          <p className="subtle m-0">{course.description}</p>
        </div>
        <div className="pill-group">
          <StatusPill status={course.status} />
          {isFocus && <span className="chip chip-focus">Focus</span>}
        </div>
      </div>

      <div className="course-progress mb-3">
        <ProgressBar 
          ratio={progress.ratio} 
          label={`Course progress: ${progressPercentage}% complete`}
        />
        <p className="subtle mt-2 m-0">
          {progress.completed}/{progress.totalLectures} lectures complete
        </p>
      </div>

      {nextLecture ? (
        <p className="my-2 m-0">
          Next up: <strong>{nextLecture.title}</strong>
        </p>
      ) : (
        <p className="subtle my-2 m-0">
          ✓ All lectures completed
        </p>
      )}

      <div className="inline-actions mt-3">
        <Link className="button" to={`/courses/${course.id}`} aria-label={`Open ${course.title}`}>
          Open Course
        </Link>
        <a 
          className="button secondary" 
          href={course.source} 
          target="_blank" 
          rel="noreferrer"
          aria-label={`View source for ${course.title} (opens in new tab)`}
        >
          View Source
        </a>
        {onFocus && (
          <button
            type="button"
            className="button secondary"
            onClick={() => onFocus(course.id)}
            aria-label={isFocus ? "Currently focused course" : `Set ${course.title} as focus course`}
            aria-pressed={isFocus}
          >
            {isFocus ? "★ Focused" : "Set Focus"}
          </button>
        )}
      </div>
    </article>
  );
};
