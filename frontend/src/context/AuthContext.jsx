import { createContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";
import { tokenStorage } from "../utils/tokenStorage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(tokenStorage.getUser());
  const [token, setToken] = useState(tokenStorage.getToken());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || user) return;
    authService.me().then(setUser).catch(() => logout());
  }, [token]);

  const login = async (payload) => {
    setLoading(true);
    try {
      const data = await authService.login(payload);
      setToken(data.access_token);
      setUser(data.user);
      tokenStorage.setToken(data.access_token);
      tokenStorage.setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = (payload) => authService.register(payload);

  const logout = () => {
    setUser(null);
    setToken(null);
    tokenStorage.clearAll();
  };

  const value = useMemo(
    () => ({ user, token, isAuthenticated: Boolean(token), loading, login, register, logout }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
