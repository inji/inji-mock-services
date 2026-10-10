import type { Notification } from "./types";

// The dashboard "Recent Activity" feed.
export const notifications: Notification[] = [
  {
    id: "act-1",
    type: "student-registered",
    title: "New student registered",
    subject: "John Smith",
    timeAgo: "2 hours ago",
  },
  {
    id: "act-2",
    type: "certificate-issued",
    title: "Certificate issued",
    subject: "Emma Johnson",
    timeAgo: "3 hours ago",
  },
  {
    id: "act-3",
    type: "student-updated",
    title: "Student information updated",
    subject: "Michael Brown",
    timeAgo: "5 hours ago",
  },
  {
    id: "act-4",
    type: "certificate-requested",
    title: "Certificate request received",
    subject: "Sarah Davis",
    timeAgo: "1 day ago",
  },
  {
    id: "act-5",
    type: "student-registered",
    title: "New student registered",
    subject: "James Wilson",
    timeAgo: "1 day ago",
  },
];
