import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, setAuthToken } from "./api";

export type Role = "PATIENT" | "DOCTOR" | "ADMIN";

export type AuthUser = {
  id: number;
  email: string;
  role: Role;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

const TOKEN_KEY = "sysint_token";
const USER_KEY = "sysint_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    const u = localStorage.getItem(USER_KEY);
    if (t) {
      setToken(t);
      setAuthToken(t);
    }
    if (u) {
      try {
        setUser(JSON.parse(u));
      } catch {
        // ignore
      }
    }
    setIsReady(true);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      token,
      isReady,
      async login(email: string, password: string) {
        const res = await api.post("/auth/login", { email, password });
        const accessToken = res.data?.data?.access_token as string;
        const u = res.data?.data?.user as AuthUser;
        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem(USER_KEY, JSON.stringify(u));
        setAuthToken(accessToken);
        setToken(accessToken);
        setUser(u);
      },
      async register(fullName: string, email: string, password: string) {
        await api.post("/auth/register", { full_name: fullName, email, password });
        await this.login(email, password);
      },
      logout() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setAuthToken(null);
        setToken(null);
        setUser(null);
      },
    }),
    [user, token, isReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

