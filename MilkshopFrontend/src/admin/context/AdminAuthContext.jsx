import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getAdminToken, storeAdminToken, clearAdminToken } from "../services/auth";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const existing = getAdminToken();
    if (existing) {
      setToken(existing);
    }
    setInitialized(true);
  }, []);

  const login = (nextToken, adminPayload) => {
    storeAdminToken(nextToken);
    setToken(nextToken);
    setAdmin(adminPayload || null);
  };

  const logout = () => {
    clearAdminToken();
    setToken(null);
    setAdmin(null);
  };

  const value = useMemo(
    () => ({
      token,
      admin,
      initialized,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, admin, initialized],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return ctx;
}

