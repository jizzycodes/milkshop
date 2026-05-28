import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getAdminFirebaseAuth, isFirebaseConfigured } from "../firebase/config";
import { signOutAdmin } from "../firebase/adminAuth";
import { fetchMyAccountSettings } from "../services/api";
import {
  getAdminToken,
  storeAdminToken,
  clearAdminToken,
  getAdminProfile,
  storeAdminProfile,
  clearAdminProfile,
} from "../services/auth";

const AdminAuthContext = createContext(null);

async function resolveAdminProfile(idToken, firebaseUser) {
  try {
    const res = await fetchMyAccountSettings(idToken);
    if (res?.data) {
      return {
        id: res.data.id,
        email: res.data.email,
        username: res.data.username,
        role: res.data.role,
      };
    }
  } catch {
    // Fall back until DB profile is available.
  }
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    username: firebaseUser.email,
    role: "user",
  };
}

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setInitialized(true);
      return undefined;
    }

    const auth = getAdminFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          const profile = await resolveAdminProfile(idToken, user);
          storeAdminToken(idToken);
          storeAdminProfile(profile);
          setToken(idToken);
          setAdmin(profile);
        } catch {
          clearAdminToken();
          clearAdminProfile();
          setToken(null);
          setAdmin(null);
        }
      } else {
        clearAdminToken();
        clearAdminProfile();
        setToken(null);
        setAdmin(null);
      }
      setInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  const login = (nextToken, adminPayload) => {
    storeAdminToken(nextToken);
    storeAdminProfile(adminPayload || null);
    setToken(nextToken);
    setAdmin(adminPayload || null);
  };

  const logout = async () => {
    try {
      if (isFirebaseConfigured()) {
        await signOutAdmin();
      }
    } catch {
      // Always clear local session even if Firebase sign-out fails.
    }
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
      firebaseConfigured: isFirebaseConfigured(),
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
