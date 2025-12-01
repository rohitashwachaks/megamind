import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { CourseCard } from "../components/CourseCard";
import { useAppState } from "../state/AppStateContext";

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
      <div className="card">
        <p style={{ margin: 0 }}>Failed to load courses: {state.error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="section-header">
        <div>
          <h1 className="page-title">My courses</h1>
          <p className="muted">Track, organize, and focus on what you want to learn next.</p>
        </div>
        <Link to="/" className="subtle">
          Back to dashboard
        </Link>
      </div>

      <section className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ margin: "0 0 10px" }}>Add a course</h3>
        <form className="grid columns-2" onSubmit={handleAddCourse}>
          <div>
            <label htmlFor="courseTitle">Title</label>
            <input
              id="courseTitle"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. 6.046J Design and Analysis of Algorithms"
            />
          </div>
          <div>
            <label htmlFor="courseSource">Source URL</label>
            <input
              id="courseSource"
              value={source}
              onChange={(event) => setSource(event.target.value)}
              placeholder="https://ocw.mit.edu/..."
            />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="courseDescription">Description</label>
            <textarea
              id="courseDescription"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Why are you taking this course?"
            />
          </div>
          <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end" }}>
            <button type="submit">Add course</button>
          </div>
        </form>
      </section>

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
    </>
  );
};

export default CoursesPage;
