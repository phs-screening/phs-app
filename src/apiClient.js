import { logOut } from './services/authSession'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

function authHeaders() {
  const t = localStorage.getItem('authToken')
  if (!t) return {}

  const payload = (() => {
    const parts = t.split('.')
    if (parts.length < 2) return null

    const base64Payload = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const paddedPayload = base64Payload + '='.repeat((4 - (base64Payload.length % 4)) % 4)

    try {
      const decoded = decodeURIComponent(
        atob(paddedPayload)
          .split('')
          .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
          .join(''),
      )

      return JSON.parse(decoded)
    } catch {
      return null
    }
  })()

  if (payload?.exp && Date.now() >= payload.exp * 1000) {
    logOut()
    return {}
  }

  return { Authorization: `Bearer ${t}` }
}

function createApiError(res, data) {
  const error = new Error(data.error || `HTTP ${res.status}`)
  error.status = res.status
  error.data = data
  return error
}

async function requestWithAuth(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...(options.headers || {}), ...authHeaders() },
  })

  const data = await parseResponse(res)

  if (!res.ok && [401, 403].includes(res.status)) {
    await logOut()
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.assign('/login')
    }
  }

  if (!res.ok) throw createApiError(res, data)
  return data
}

export async function apiGet(path) {
  return requestWithAuth(path)
}

export async function apiPost(path, body) {
  return requestWithAuth(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export async function apiPatch(path, body) {
  return requestWithAuth(path, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export async function apiDelete(path) {
  return requestWithAuth(path, {
    method: 'DELETE',
  })
}

async function parseResponse(res) {
  const text = await res.text()
  if (!text) {
    return {}
  }

  try {
    return JSON.parse(text)
  } catch {
    return {
      error: `Expected JSON from API but received: ${text.slice(0, 120)}`,
    }
  }
}
