// ---------------------------------------------------------------------------
// Auth Service
// Encapsulates authentication & current user session operations.
// Currently returns mock data; ready for future REST API integration.
// ---------------------------------------------------------------------------

import { currentUser, users } from "@/data";
import type { User } from "@/data/types";
import { API_ENDPOINTS } from "@/config/api";

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  /** Authenticate user with credentials. */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const user = users.find((u) => u.email === credentials.email) || {
      ...currentUser,
      email: credentials.email || currentUser.email,
    };

    return {
      user,
      token: "mock-jwt-token-xyz123",
    };
  },

  _loggedInStudentId: "STU-2442-23" as string | null,

  setLoggedInStudentId(id: string | null) {
    this._loggedInStudentId = id;
  },

  getLoggedInStudentId(): string | null {
    return this._loggedInStudentId;
  },

  /** Log out current session. */
  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    // API endpoint reference: fetch(API_ENDPOINTS.auth.logout, { method: "POST" })
  },

  /** Get details of the currently authenticated user. */
  async getCurrentUser(): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    // API endpoint reference: fetch(API_ENDPOINTS.auth.me)
    return currentUser;
  },

  /** Refresh authentication token. */
  async refreshToken(): Promise<{ token: string }> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    // API endpoint reference: fetch(API_ENDPOINTS.auth.refresh, { method: "POST" })
    return { token: "refreshed-mock-jwt-token-xyz123" };
  },
};
