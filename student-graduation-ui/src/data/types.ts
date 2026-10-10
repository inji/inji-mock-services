// ---------------------------------------------------------------------------
// Shared domain type definitions for the Educational Institute Portal.
//
// These interfaces describe the business entities displayed throughout the
// application. They are intended to be the single source of truth for the
// shape of the data, so that future backend integration can swap the mock
// data files for real API responses without changing consumers.
// ---------------------------------------------------------------------------

export type Role = "admin" | "student";

export type StudentStatus = "Active" | "Inactive" | "Graduated";

export type AcademicYear =
  | "First Year"
  | "Second Year"
  | "Third Year"
  | "Final Year";

/** A person authorized to access the portal. */
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

/** The institution that owns this portal. */
export interface Institute {
  name: string;
  portalLabel: string;
  systemName: string;
}

/** Guardian / parent contact details attached to a student. */
export interface Guardian {
  name: string;
  phone: string;
}

/** A registered student record. */
export interface Student {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  phone: string;
  course: string;
  year: AcademicYear;
  cgpa: number;
  status: StudentStatus;
  graduating: boolean;
  dateOfBirth?: string;
  address?: string;
  enrollmentDate?: string;
  graduationYear?: string;
  guardian?: Guardian;
  creditsCompleted?: number;
  totalCredits?: number;
  numberOfSemesters?: number;
  registrationNumber?: string;
  createdAt?: string;
  updatedAt?: string;
  graduationDetails?: {
    id?: string;
    registrationNumber?: string;
    degreeTitle?: string;
    graduationMonth?: number;
    graduationYear?: number;
    classification?: string;
    certificateStatus?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}


/** A degree certificate associated with a student. */
export interface Certificate {
  id: string;
  studentId: string;
  registrationNumber: string;
  degreeTitle: string;
  graduationMonth?: string;
  graduationYear: string;
  semesters?: number;
}

/** A single statistic tile shown on the dashboard. */
export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  caption: string;
}

/** An entry in the dashboard "Upcoming Graduations" list. */
export interface UpcomingGraduation {
  id: string;
  period: string;
  studentsLabel: string;
  program: string;
}

export type ActivityType =
  | "student-registered"
  | "certificate-issued"
  | "student-updated"
  | "certificate-requested";

/** An entry in the dashboard "Recent Activity" feed. */
export interface Notification {
  id: string;
  type: ActivityType;
  title: string;
  subject: string;
  timeAgo: string;
}

/** Aggregated dashboard payload. */
export interface DashboardStats {
  stats: DashboardStat[];
  recentActivity: Notification[];
  upcomingGraduations: UpcomingGraduation[];
  newlyRegisteredStudentIds: string[];
}

/** Certificate verification record (used by future verification flows). */
export interface Verification {
  id: string;
  certificateId: string;
  verified: boolean;
  verifiedAt?: string;
}

// ---------------------------------------------------------------------------
// Student Portal Types
// ---------------------------------------------------------------------------

export type StudentNotificationType = "success" | "info";

/** A notification shown in the Student Portal dashboard. */
export interface StudentNotification {
  id: string;
  message: string;
  timeAgo: string;
  type: StudentNotificationType;
}

/** A single stat tile shown on the Student Portal dashboard. */
export interface StudentDashboardStat {
  id: string;
  label: string;
  value: string;
  icon: "cgpa" | "credits" | "certificates";
}

/** Aggregated student dashboard payload. */
export interface StudentDashboardData {
  student: Student;
  notifications: StudentNotification[];
  stats: StudentDashboardStat[];
}

export interface CourseGrade {
  code: string;
  name: string;
  credits: number;
  grade: string;
  points: number;
}

export interface SemesterRecord {
  semesterName: string;
  year: string;
  semesterGpa: number;
  courses: CourseGrade[];
}

export interface AcademicPerformanceData {
  overallCgpa: number;
  creditsCompleted: number;
  totalCredits: number;
  semesters: SemesterRecord[];
}
