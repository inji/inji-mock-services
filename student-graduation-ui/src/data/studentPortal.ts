import type { StudentNotification, StudentDashboardStat } from "./types";

// ---------------------------------------------------------------------------
// Student Portal Mock Data
// Notifications and dashboard stat tiles shown in the Student Portal.
// ---------------------------------------------------------------------------

/** Notifications displayed on the student dashboard. */
export const studentNotifications: StudentNotification[] = [
  {
    id: "sn-1",
    message: "Your degree certificate request has been approved!",
    timeAgo: "2 hours ago",
    type: "success",
  },
  {
    id: "sn-2",
    message: "Semester results are now available",
    timeAgo: "1 day ago",
    type: "info",
  },
];

/** Stat tiles at the bottom of the student dashboard. */
export const studentDashboardStats: StudentDashboardStat[] = [
  { id: "s-cgpa", label: "Current CGPA", value: "8.5", icon: "cgpa" },
  { id: "s-credits", label: "Completed Credits", value: "0/0", icon: "credits" },
  { id: "s-certs", label: "Certificates", value: "0", icon: "certificates" },
];

import type { AcademicPerformanceData } from "./types";

export const studentAcademicPerformance: AcademicPerformanceData = {
  overallCgpa: 8.5,
  creditsCompleted: 0,
  totalCredits: 0,
  semesters: [
    {
      semesterName: "Semester 8",
      year: "2026",
      semesterGpa: 8.7,
      courses: [
        { code: "CS401", name: "Machine Learning", credits: 4, grade: "A", points: 9.0 },
        { code: "CS402", name: "Cloud Computing", credits: 4, grade: "A", points: 9.0 },
        { code: "CS403", name: "Capstone Project", credits: 6, grade: "A+", points: 10.0 },
        { code: "CS404", name: "Cybersecurity", credits: 3, grade: "B+", points: 8.0 },
      ]
    },
    {
      semesterName: "Semester 7",
      year: "2025",
      semesterGpa: 8.4,
      courses: [
        { code: "CS301", name: "Database Systems", credits: 4, grade: "A", points: 9.0 },
        { code: "CS302", name: "Web Technologies", credits: 4, grade: "B+", points: 8.0 },
        { code: "CS303", name: "Software Engineering", credits: 4, grade: "A", points: 9.0 },
        { code: "CS304", name: "Operating Systems", credits: 3, grade: "A-", points: 8.5 },
      ]
    }
  ]
};
