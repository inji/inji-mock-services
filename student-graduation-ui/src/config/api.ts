// ---------------------------------------------------------------------------
// API Configuration
// Central configuration for API endpoint URLs and base headers.
// ---------------------------------------------------------------------------

// In development, Vite proxy forwards /api → http://localhost:8085/api
// In production, set VITE_API_BASE_URL to the deployed backend URL.
export const API_BASE_URL: string =
  (import.meta.env?.VITE_API_BASE_URL as string) || "/api";

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    logout: `${API_BASE_URL}/auth/logout`,
    refresh: `${API_BASE_URL}/auth/refresh`,
    me: `${API_BASE_URL}/auth/me`,
  },
  dashboard: `${API_BASE_URL}/dashboard`,
  institute: `${API_BASE_URL}/institute`,
  students: `${API_BASE_URL}/students`,
  graduation: `${API_BASE_URL}/graduation`,
  certificates: `${API_BASE_URL}/certificates`,
  notifications: `${API_BASE_URL}/notifications`,
} as const;

export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "X-API-Key": "certify-admin-key-change-me",
};
