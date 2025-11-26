import { AppState } from "../types";

export const seedState: AppState = {
  userName: "Learner",
  focusCourseId: "mit-6006",
  courses: [
    {
      id: "mit-6006",
      title: "6.006 Introduction to Algorithms (Fall 2020)",
      description:
        "Design and analysis of algorithms with practical problem-solving. Based on MIT OCW.",
      source: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2020",
      status: "active",
      notes: "Focus course for the month. Aim for 2 lectures per week.",
      tags: ["algorithms", "computer science"],
      lectures: [
        {
          id: "l1",
          order: 1,
          title: "Lecture 1 – Algorithmic Thinking",
          videoUrl:
            "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2020/resources/lecture-1-introduction",
          status: "completed",
          durationMinutes: 50,
          note: "Solid intro; revisit recursion tree examples."
        },
        {
          id: "l2",
          order: 2,
          title: "Lecture 2 – Divide and Conquer",
          videoUrl:
            "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2020/resources/lecture-2-divide-and-conquer",
          status: "in_progress",
          durationMinutes: 55
        },
        {
          id: "l3",
          order: 3,
          title: "Lecture 3 – Asymptotic Notation",
          videoUrl:
            "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2020/resources/lecture-3-asymptotic-notation",
          status: "not_started",
          durationMinutes: 50
        }
      ],
      assignments: [
        {
          id: "a1",
          title: "Problem Set 1 – Divide & Conquer",
          status: "in_progress",
          dueDate: "",
          link:
            "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2020/resources/ps1-divide-and-conquer/",
          note: ""
        },
        {
          id: "a2",
          title: "Problem Set 2 – Growth of Functions",
          status: "not_started",
          link:
            "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2020/resources/ps2-growth-of-functions/",
          note: ""
        }
      ]
    },
    {
      id: "mit-60001",
      title: "6.0001 Introduction to Computer Science and Programming",
      description:
        "Python-first intro to CS from MIT OCW. Good for fundamentals and brushing up.",
      source: "https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016",
      status: "active",
      notes: "Use this for lighter sessions. Pair with small coding exercises.",
      tags: ["python", "intro"],
      lectures: [
        {
          id: "p1",
          order: 1,
          title: "Lecture 1 – What is Computation?",
          videoUrl:
            "https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/resources/lecture-1-what-is-computation/",
          status: "completed",
          durationMinutes: 45,
          note: "Keep notes on problem-solving framework."
        },
        {
          id: "p2",
          order: 2,
          title: "Lecture 2 – Branching and Iteration",
          videoUrl:
            "https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/resources/lecture-2-branching-and-iteration/",
          status: "not_started",
          durationMinutes: 50
        }
      ],
      assignments: [
        {
          id: "p1-a",
          title: "Problem Set 1 – Python Basics",
          status: "not_started",
          dueDate: "",
          link:
            "https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/resources/ps1/",
          note: ""
        }
      ]
    }
  ]
};
