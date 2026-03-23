const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

async function handleResponse(response) {
  let body;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message = body?.error || body?.message || "Something went wrong";
    const error = new Error(message);
    error.status = response.status;
    error.data = body;
    throw error;
  }

  return body;
}

export async function adminLoginRequest(payload) {
  const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
    }),
  });

  return handleResponse(response);
}

export async function fetchAdminDashboard(token) {
  const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}

export async function fetchRecentFranchiseRequests(token, { pageSize = 5 } = {}) {
  const params = new URLSearchParams({
    page: "1",
    pageSize: String(pageSize),
  });

  const response = await fetch(`${API_BASE_URL}/api/admin/franchise-requests?${params.toString()}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}

export async function fetchFranchiseRequests(token, { page = 1, pageSize = 10, from, to, search } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  if (from) params.set("from", from);
  if (to) params.set("to", to);
  if (search) params.set("search", search);

  const response = await fetch(`${API_BASE_URL}/api/admin/franchise-requests?${params.toString()}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}

/** Qr & Email: franchise QR URL + confirmation email template (global). */
export async function fetchQrEmailSettings(token) {
  if (!token || String(token).trim() === "") {
    throw new Error("Authorization token missing — sign in at /admin/login.");
  }
  const response = await fetch(`${API_BASE_URL}/api/admin/settings/qr-email`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}

export async function updateQrEmailSettings(token, payload) {
  if (!token || String(token).trim() === "") {
    throw new Error("Authorization token missing — sign in at /admin/login.");
  }
  const response = await fetch(`${API_BASE_URL}/api/admin/settings/qr-email`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function fetchMyAccountSettings(token) {
  const response = await fetch(`${API_BASE_URL}/api/admin/settings/account/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
}

export async function updateMyAccountSettings(token, payload) {
  const response = await fetch(`${API_BASE_URL}/api/admin/settings/account/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

export async function fetchAllAccounts(token) {
  const response = await fetch(`${API_BASE_URL}/api/admin/settings/account/accounts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
}

export async function createAccountByAdmin(token, payload) {
  const response = await fetch(`${API_BASE_URL}/api/admin/settings/account/accounts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

export async function updateAccountByAdmin(token, id, payload) {
  const response = await fetch(`${API_BASE_URL}/api/admin/settings/account/accounts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

export async function fetchMonitorSummary(token, { days = 14, from, to, sectionSearch } = {}) {
  if (!token || String(token).trim() === "") {
    throw new Error("Authorization token missing. Please sign in again.");
  }
  const params = new URLSearchParams({ days: String(days) });
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  if (sectionSearch) params.set("sectionSearch", sectionSearch);
  const response = await fetch(`${API_BASE_URL}/api/admin/monitor/summary?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
}

/** Admin only — clears all website tracking events (Monitor goes to zero). */
export async function resetMonitorMetrics(token) {
  if (!token || String(token).trim() === "") {
    throw new Error("Authorization token missing. Please sign in again.");
  }
  const response = await fetch(`${API_BASE_URL}/api/admin/monitor/metrics`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
}

export async function postTrackingEvents(payload) {
  try {
    await fetch(`${API_BASE_URL}/api/track/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Fail-safe: tracking must never crash UX.
  }
}

