import type { User } from "./types";

// The authenticated administrator. Used to prefill the login form and header.
export const currentUser: User = {
  id: "user-admin-1",
  name: "Admin",
  email: "admin@institute.edu",
  role: "admin",
};

export const users: User[] = [currentUser];
