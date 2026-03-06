const ADMIN_TOKEN_KEY = "milkshop_admin_token";

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

