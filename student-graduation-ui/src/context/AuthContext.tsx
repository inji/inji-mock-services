// ---------------------------------------------------------------------------
// Auth Context
// Provides session state (User, Token, Role) and authentication actions.
// Architecture preparation for future backend auth token management.
// ---------------------------------------------------------------------------

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { User, Role } from "@/data/types";
import { currentUser } from "@/data/users";
import { authService, LoginCredentials } from "@/services/authService";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(currentUser);
  const [token, setToken] = useState<string | null>("mock-jwt-token");
  const [role, setRole] = useState<Role | null>(currentUser.role);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const res = await authService.login(credentials);
    setUser(res.user);
    setToken(res.token);
    setRole(res.user.role);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
    setRole(null);
  }, []);

  const refreshToken = useCallback(async () => {
    const res = await authService.refreshToken();
    setToken(res.token);
  }, []);

  const value: AuthContextType = {
    user,
    token,
    role,
    isAuthenticated: Boolean(token && user),
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
