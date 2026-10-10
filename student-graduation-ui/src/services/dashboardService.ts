// ---------------------------------------------------------------------------
// Dashboard Service
// Computes dashboard statistics from the live backend student records.
// ---------------------------------------------------------------------------

import type { DashboardStats, DashboardStat, Notification, UpcomingGraduation, Student } from "@/data/types";
import { studentService } from "./studentService";
import { activityService, parseDate } from "./activityService";

export const dashboardService = {
  /** Fetch all dashboard data using live students list */
  async getDashboard(): Promise<DashboardStats> {
    const students = await studentService.getStudents();
    const stats = dashboardService.computeStatTiles(students);
    const recentActivity = activityService.getRecentActivities(students);
    const upcomingGraduations = dashboardService.getUpcomingGraduations();

    // Sort newly registered students by createdAt (descending)
    const sortedStudents = [...students].sort((a, b) => {
      const timeA = parseDate(a.createdAt)?.getTime() || 0;
      const timeB = parseDate(b.createdAt)?.getTime() || 0;
      return timeB - timeA;
    });

    return {
      stats,
      recentActivity,
      upcomingGraduations,
      newlyRegisteredStudentIds: sortedStudents.map((s) => s.studentId),
    };
  },

  /** Compute dashboard statistic tiles from real student records */
  computeStatTiles(students: Student[]): DashboardStat[] {
    const currentYear = new Date().getFullYear();

    // 1. Total Students in backend
    const totalStudents = students.length;

    // 2. Active Students: students not graduated
    const activeStudents = students.filter(
      (s) => (s.status || "").toUpperCase() !== "GRADUATED"
    ).length;

    // 3. Courses Offered: distinct course programs offered
    const distinctCourses = new Set(students.map((s) => s.course).filter(Boolean));
    const coursesCount = distinctCourses.size;

    // 4. Graduating This Year: expected to graduate in currentYear or in Final Year
    const graduatingThisYear = students.filter((s) => {
      const yr = s.graduationDetails?.graduationYear
        ? Number(s.graduationDetails.graduationYear)
        : s.graduationYear
        ? Number(s.graduationYear)
        : null;
      return yr === currentYear || s.year === "Final Year";
    }).length;

    // 5. Certificates Issued: according to graduated logic (status GRADUATED or certificate ISSUED)
    const certificatesIssued = students.filter(
      (s) =>
        (s.status || "").toUpperCase() === "GRADUATED" ||
        s.graduationDetails?.certificateStatus?.toUpperCase() === "ISSUED"
    ).length;

    // 6. Pending Requests: final year students that are not yet issued certificates
    const pendingRequests = students.filter((s) => {
      const isFinalOrPending =
        s.year === "Final Year" ||
        s.graduationDetails?.certificateStatus?.toUpperCase() === "PENDING";
      const isIssued =
        (s.status || "").toUpperCase() === "GRADUATED" ||
        s.graduationDetails?.certificateStatus?.toUpperCase() === "ISSUED";
      return isFinalOrPending && !isIssued;
    }).length;

    return [
      {
        id: "total-students",
        label: "Total Students",
        value: totalStudents.toLocaleString(),
        caption: "",
      },
      {
        id: "active-students",
        label: "Active Students",
        value: activeStudents.toLocaleString(),
        caption: "",
      },
      {
        id: "courses-offered",
        label: "Courses Offered",
        value: String(coursesCount),
        caption: "",
      },
      {
        id: "graduating-this-year",
        label: "Graduating This Year",
        value: graduatingThisYear.toLocaleString(),
        caption: `Expected in ${currentYear}`,
      },
      {
        id: "certificates-issued",
        label: "Certificates Issued",
        value: certificatesIssued.toLocaleString(),
        caption: "All-time total",
      },
      {
        id: "pending-requests",
        label: "Pending Requests",
        value: pendingRequests.toLocaleString(),
        caption: pendingRequests > 0 ? "Requires attention" : "All clear",
      },
    ];
  },

  /** Fetch upcoming graduation events (0 Students as specified) */
  getUpcomingGraduations(): UpcomingGraduation[] {
    return [
      { id: "grad-may-2026", period: "May 2026", studentsLabel: "0 Students", program: "Various Programs" },
      { id: "grad-aug-2026", period: "August 2026", studentsLabel: "0 Students", program: "Various Programs" },
      { id: "grad-dec-2026", period: "December 2026", studentsLabel: "0 Students", program: "Various Programs" },
    ];
  },
};
