// ---------------------------------------------------------------------------
// Activity Service
// Manages real activity feed for the portal dashboard.
// Tracks student registration, certificate issuance, edits, and requests.
// ---------------------------------------------------------------------------

import type { Notification, ActivityType, Student } from "@/data/types";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  subject: string;
  timestamp: string;
}

const STORAGE_KEY = "portal_activity_log_v3";

/**
 * Safely parse an ISO date string or timestamp, treating timestamps without timezone as UTC.
 */
export function parseDate(dateInput?: string | number | Date | null): Date | null {
  if (!dateInput) return null;
  if (dateInput instanceof Date) {
    return isNaN(dateInput.getTime()) ? null : dateInput;
  }
  if (typeof dateInput === "number") {
    const d = new Date(dateInput);
    return isNaN(d.getTime()) ? null : d;
  }

  let str = String(dateInput).trim();
  // Handle space separator if present e.g. "2026-10-08 22:31:57"
  if (str.includes(" ") && !str.includes("T")) {
    str = str.replace(" ", "T");
  }
  // If ISO string without timezone offset or Z, append "Z" because backend stores UTC
  if (str.includes("T")) {
    if (!str.endsWith("Z") && !/[+-]\d{2}(:?\d{2})?$/.test(str)) {
      str += "Z";
    }
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Calculate accurate human-readable relative time based on real UTC timestamp.
 */
export function formatRelativeTime(dateInput?: string | number | Date | null): string {
  const date = parseDate(dateInput);
  if (!date) return "Recently";

  const now = new Date();
  const diffInSeconds = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));

  if (diffInSeconds < 45) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "1 day ago";
  if (diffInDays < 30) return `${diffInDays} days ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths === 1) return "1 month ago";
  if (diffInMonths < 12) return `${diffInMonths} months ago`;
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears === 1 ? "" : "s"} ago`;
}

export const activityService = {
  /** Log a new real user activity into persistent local storage */
  logActivity(activity: { type: ActivityType; title: string; subject: string; timestamp?: string }): void {
    try {
      const existingStr = localStorage.getItem(STORAGE_KEY);
      const existing: ActivityItem[] = existingStr ? JSON.parse(existingStr) : [];
      const newItem: ActivityItem = {
        id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        type: activity.type,
        title: activity.title,
        subject: activity.subject,
        timestamp: activity.timestamp || new Date().toISOString(),
      };
      const updated = [newItem, ...existing].slice(0, 50);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn("Failed to log activity:", err);
    }
  },

  /** Get real recent activities from actual events and live students */
  getRecentActivities(students: Student[] = []): Notification[] {
    let localActivities: ActivityItem[] = [];
    try {
      // Clear legacy storage keys to eliminate any previous mock/synthetic entries
      localStorage.removeItem("portal_recent_activities");
      localStorage.removeItem("portal_activity_log");
      localStorage.removeItem("portal_activity_log_v2");

      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        localActivities = JSON.parse(raw);
      }
    } catch {
      localActivities = [];
    }

    // Build real activity items from backend students
    const studentActivities: ActivityItem[] = [];

    students.forEach((s) => {
      // 1. Genuine registration activity based on createdAt
      if (s.createdAt) {
        studentActivities.push({
          id: `reg-${s.studentId}`,
          type: "student-registered",
          title: "New student registered",
          subject: s.fullName,
          timestamp: s.createdAt,
        });
      }

      // 2. Genuine certificate issued activity (for graduated students)
      const isGraduated =
        (s.status && s.status.toUpperCase() === "GRADUATED") ||
        (s.graduationDetails?.certificateStatus && s.graduationDetails.certificateStatus.toUpperCase() === "ISSUED");

      if (isGraduated) {
        studentActivities.push({
          id: `cert-${s.studentId}`,
          type: "certificate-issued",
          title: "Certificate issued",
          subject: s.fullName,
          timestamp: s.graduationDetails?.updatedAt || s.graduationDetails?.createdAt || s.createdAt || new Date().toISOString(),
        });
      }
    });

    // Merge: stored real-time user actions take precedence
    const map = new Map<string, ActivityItem>();
    studentActivities.forEach((item) => map.set(item.id, item));
    localActivities.forEach((item) => map.set(item.id, item));

    const all = Array.from(map.values());
    all.sort((a, b) => {
      const timeA = parseDate(a.timestamp)?.getTime() || 0;
      const timeB = parseDate(b.timestamp)?.getTime() || 0;
      return timeB - timeA;
    });

    // Return top 5 formatted notifications with accurate relative time
    return all.slice(0, 5).map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      subject: item.subject,
      timeAgo: formatRelativeTime(item.timestamp),
    }));
  },
};

