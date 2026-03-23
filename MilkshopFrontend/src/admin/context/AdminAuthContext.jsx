import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getAdminToken,
  storeAdminToken,
  clearAdminToken,
  getAdminProfile,
  storeAdminProfile,
  clearAdminProfile,
} from "../services/auth";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const existing = getAdminToken();
    const profile = getAdminProfile();
    if (existing) {
      setToken(existing);
    }
    if (profile) {
      setAdmin(profile);
    }
    setInitialized(true);
  }, []);

  const login = (nextToken, adminPayload) => {
    storeAdminToken(nextToken);
    storeAdminProfile(adminPayload || null);
    setToken(nextToken);
    setAdmin(adminPayload || null);
  };

  const logout = () => {
    clearAdminToken();
    clearAdminProfile();
    setToken(null);
    setAdmin(null);
  };

  const setAdminProfile = (payload) => {
    storeAdminProfile(payload || null);
    setAdmin(payload || null);
  };

  const value = useMemo(
    () => ({
      token,
      admin,
      initialized,
      isAuthenticated: Boolean(token),
      login,
      logout,
      setAdminProfile,
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

