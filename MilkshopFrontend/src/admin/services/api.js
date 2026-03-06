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

