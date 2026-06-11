const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

function authHeaders() {
  const t = localStorage.getItem('authToken');
  return t ? { Authorization: `Bearer ${t}` } : {};
}

function createApiError(res, data) {
  const error = new Error(data.error || `HTTP ${res.status}`);
  error.status = res.status;
  error.data = data;
  return error;
}

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, { headers: { ...authHeaders() } });
  const data = await parseResponse(res)
  if (!res.ok) throw createApiError(res, data);
  return data;
}

export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body)
  });

  const data = await parseResponse(res);

  if (!res.ok) throw createApiError(res, data);
  return data;
}

export async function apiPatch(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body)
  });

  const data = await parseResponse(res);
  if (!res.ok) throw createApiError(res, data);
  return data;
}

export async function apiDelete(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    headers: { ...authHeaders() }
  });

  const data = await parseResponse(res);
  if (!res.ok) throw createApiError(res, data);
  return data;
}

async function parseResponse(res) {
  const text = await res.text();
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return {
      error: `Expected JSON from API but received: ${text.slice(0, 120)}`,
    };
  }
}
