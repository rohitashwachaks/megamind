import { AssignmentStatus, Course, Lecture } from "../types";

export const getCourseProgress = (course: Course) => {
  const totalLectures = course.lectures.length || 1;
  const completed = course.lectures.filter((lecture) => lecture.status === "completed").length;
  const inProgress = course.lectures.filter((lecture) => lecture.status === "in_progress").length;
  const ratio = completed / totalLectures;
  return { completed, inProgress, totalLectures, ratio };
};

export const getNextLecture = (course: Course): Lecture | undefined => {
  const sorted = [...course.lectures].sort((a, b) => a.order - b.order);
  return (
    sorted.find((lecture) => lecture.status === "in_progress") ||
    sorted.find((lecture) => lecture.status !== "completed")
  );
};

export const countAssignmentsByStatus = (course: Course) => {
  const initial: Record<AssignmentStatus, number> = {
    not_started: 0,
    in_progress: 0,
    submitted: 0,
    skipped: 0
  };
  return course.assignments.reduce((acc, assignment) => {
    acc[assignment.status] += 1;
    return acc;
  }, initial);
};
