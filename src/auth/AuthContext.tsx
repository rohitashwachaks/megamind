import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { apiClient } from "@/api/client";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, confirmPassword: string, displayName?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

interface AuthProviderProps {
  readonly children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "pocketschool_auth_token";
const USER_KEY = "pocketschool_user";

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token and user from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Failed to parse stored user data:", error);
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
      }
    } catch (error) {
      console.warn("localStorage access blocked, using session storage instead:", error);
      // Fallback to sessionStorage if localStorage is blocked (Safari privacy mode)
      try {
        const storedToken = sessionStorage.getItem(TOKEN_KEY);
        const storedUser = sessionStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
          try {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          } catch (parseError) {
            console.error("Failed to parse stored user data:", parseError);
            sessionStorage.removeItem(TOKEN_KEY);
            sessionStorage.removeItem(USER_KEY);
          }
        }
      } catch (sessionError) {
        console.warn("Session storage also blocked, continuing without auth:", sessionError);
      }
    }

    setIsLoading(false);
  }, []);

  // Save token and user to localStorage when they change
  useEffect(() => {
    try {
      if (token && user) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    } catch (error) {
      console.warn("localStorage access blocked, using session storage instead:", error);
      // Fallback to sessionStorage if localStorage is blocked (Safari privacy mode)
      try {
        if (token && user) {
          sessionStorage.setItem(TOKEN_KEY, token);
          sessionStorage.setItem(USER_KEY, JSON.stringify(user));
        } else {
          sessionStorage.removeItem(TOKEN_KEY);
          sessionStorage.removeItem(USER_KEY);
        }
      } catch (sessionError) {
        console.warn("Session storage also blocked, continuing without persistence:", sessionError);
      }
    }
  }, [token, user]);

  const login = useMemo(() => async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password);
      setToken(response.token);
      setUser(response.user);
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  }, []);

  const register = useMemo(() => async (email: string, password: string, confirmPassword: string, displayName?: string) => {
    try {
      const response = await apiClient.register(email, password, confirmPassword, displayName);
      setToken(response.token);
      setUser(response.user);
    } catch (error: any) {
      throw new Error(error.message || "Registration failed");
    }
  }, []);

  const logout = useMemo(() => () => {
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (error) {
      console.warn("localStorage access blocked, trying session storage:", error);
      try {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
      } catch (sessionError) {
        console.warn("Session storage also blocked:", sessionError);
      }
    }
  }, []);

  const refreshUser = useMemo(() => async () => {
    if (!token) return;

    try {
      const userData = await apiClient.getCurrentUser(token);
      setUser(userData);
    } catch (error) {
      console.error("Failed to refresh user:", error);
      // Token might be expired, log out
      logout();
    }
  }, [token, logout]);

  const value: AuthContextType = useMemo(() => ({
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  }), [user, token, isLoading, login, register, logout, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  console.log(context);
  return context;
}
