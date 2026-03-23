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

export async function fetchLeads(token, options = {}) {
  const {
    page = 1,
    pageSize = 10,
    search,
    from,
    to,
    tab,
    stage,
    status,
    assignedTo,
  } = options;

  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  if (search) params.set("search", search);
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  if (tab) params.set("tab", tab);
  if (stage) params.set("stage", stage);
  if (status) params.set("status", status);
  if (assignedTo) params.set("assignedTo", assignedTo);

  const response = await fetch(`${API_BASE_URL}/api/admin/leads?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}

export async function fetchLeadById(token, id) {
  const response = await fetch(`${API_BASE_URL}/api/admin/leads/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}

export async function fetchLeadFocusStats(token) {
  const response = await fetch(`${API_BASE_URL}/api/admin/leads/focus-stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}

export async function fetchLeadContactLogs(token, id) {
  const response = await fetch(`${API_BASE_URL}/api/admin/leads/${id}/contact-logs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(response);
}

export async function createLeadContactLog(token, id, payload) {
  const response = await fetch(`${API_BASE_URL}/api/admin/leads/${id}/contact-logs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function updateLead(token, id, payload) {
  const response = await fetch(`${API_BASE_URL}/api/admin/leads/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

