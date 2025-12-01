import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { CourseCard } from "../components/CourseCard";
import { useAppState } from "../state/AppStateContext";
import { LoadingSkeleton } from "../components/LoadingSpinner";
import { ErrorState } from "../components/ErrorState";
import { EmptyState } from "../components/EmptyState";

const CoursesPage = () => {
  const { state, addCourse, setFocusCourse } = useAppState();
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");

  const handleAddCourse = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !source.trim()) return;

    const newCourse = {
      title: title.trim(),
      description: description.trim() || "New course",
      source: source.trim()
    };
    await addCourse(newCourse);
    setTitle("");
    setSource("");
    setDescription("");
  };

  if (state.loading.isLoading) {
    return (
      <div>
        <div className="mb-4">
          <div className="skeleton-line skeleton-line-title mb-2" style={{ width: '150px' }} />
          <div className="skeleton-line skeleton-line-subtitle" style={{ width: '350px' }} />
        </div>
        <LoadingSkeleton count={4} />
      </div>
    );
  }

  if (state.error) {
    return (
      <ErrorState
        title="Unable to load courses"
        message="We couldn't load your courses. Please check your connection and try again."
      />
    );
  }

  return (
    <>
      <div className="section-header mb-4">
        <div>
          <h1 className="page-title m-0 mb-2">📚 My Courses</h1>
          <p className="muted m-0">Track, organize, and focus on what you want to learn next.</p>
        </div>
        <Link to="/" className="subtle" aria-label="Back to dashboard">
          ← Back
        </Link>
      </div>

      <section className="card mb-4">
        <h3 className="m-0 mb-3">✨ Add a Course</h3>
        <form className="grid columns-2" onSubmit={handleAddCourse}>
          <div>
            <label htmlFor="courseTitle">Course Title *</label>
            <input
              id="courseTitle"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. 6.046J Design and Analysis of Algorithms"
              required
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="courseSource">Source URL *</label>
            <input
              id="courseSource"
              type="url"
              value={source}
              onChange={(event) => setSource(event.target.value)}
              placeholder="https://ocw.mit.edu/..."
              required
              aria-required="true"
            />
          </div>
          <div className="full-width">
            <label htmlFor="courseDescription">Description (optional)</label>
            <textarea
              id="courseDescription"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Why are you taking this course? What do you hope to learn?"
              rows={3}
            />
          </div>
          <div className="full-width flex justify-end">
            <button type="submit" disabled={!title.trim() || !source.trim()}>
              Add Course
            </button>
          </div>
        </form>
      </section>

      {state.courses.length === 0 ? (
        <EmptyState
          icon="🎓"
          title="Start your learning journey"
          description="Add your first course above to begin tracking your progress and organizing your studies."
        />
      ) : (
        <div className="grid columns-2">
          {state.courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isFocus={state.user?.focusCourseId === course.id}
              onFocus={(courseId) => setFocusCourse(courseId)}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default CoursesPage;
