const ADMIN_TOKEN_KEY = "milkshop_admin_token";
const ADMIN_PROFILE_KEY = "milkshop_admin_profile";

export function storeAdminToken(token) {
  if (!token) return;
  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function getAdminToken() {
  return window.localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function clearAdminToken() {
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function storeAdminProfile(profile) {
  if (!profile) {
    window.localStorage.removeItem(ADMIN_PROFILE_KEY);
    return;
  }
  window.localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(profile));
}

export function getAdminProfile() {
  const raw = window.localStorage.getItem(ADMIN_PROFILE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearAdminProfile() {
  window.localStorage.removeItem(ADMIN_PROFILE_KEY);
}

