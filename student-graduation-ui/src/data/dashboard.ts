import type { DashboardStat, DashboardStats, UpcomingGraduation } from "./types";
import { notifications } from "./notifications";
import { newlyRegisteredStudentIds } from "./students";

// The six statistic tiles at the top of the dashboard.
export const dashboardStatTiles: DashboardStat[] = [
  { id: "total-students", label: "Total Students", value: "150,234", caption: "" },
  { id: "active-students", label: "Active Students", value: "15,567", caption: "" },
  { id: "courses-offered", label: "Courses Offered", value: "6", caption: "" },
  {
    id: "graduating-this-year",
    label: "Graduating This Year",
    value: "5,234",
    caption: "Expected in 2026",
  },
  {
    id: "certificates-issued",
    label: "Certificates Issued",
    value: "142,890",
    caption: "All-time total",
  },
  {
    id: "pending-requests",
    label: "Pending Requests",
    value: "47",
    caption: "Requires attention",
  },
];

// The dashboard "Upcoming Graduations" list.
export const upcomingGraduations: UpcomingGraduation[] = [
  { id: "grad-may-2026", period: "May 2026", studentsLabel: "0 Students", program: "Various Programs" },
  { id: "grad-aug-2026", period: "August 2026", studentsLabel: "0 Students", program: "Various Programs" },
  { id: "grad-dec-2026", period: "December 2026", studentsLabel: "0 Students", program: "Various Programs" },
];

// Aggregated dashboard payload consumed by the dashboard screen.
export const dashboardStats: DashboardStats = {
  stats: dashboardStatTiles,
  recentActivity: notifications,
  upcomingGraduations,
  newlyRegisteredStudentIds,
};
