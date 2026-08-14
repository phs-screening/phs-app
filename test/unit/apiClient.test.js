import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { apiDelete, apiGet, apiPatch, apiPost } from '../../src/apiClient'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

function mockResponse({ ok = true, status = 200, body = '{}' } = {}) {
  return {
    ok,
    status,
    text: vi.fn().mockResolvedValue(body),
  }
}

describe('apiClient', () => {
  beforeEach(() => {
    localStorage.clear()
    globalThis.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
  })

  it('apiGet sends the auth header when an auth token exists', async () => {
    localStorage.setItem('authToken', 'token-123')
    fetch.mockResolvedValue(mockResponse({ body: '{"ok":true}' }))

    await expect(apiGet('/patients')).resolves.toEqual({ ok: true })

    expect(fetch).toHaveBeenCalledWith(`${API_BASE}/patients`, {
      headers: { Authorization: 'Bearer token-123' },
    })
  })

  it('apiPost sends JSON with the expected content type', async () => {
    fetch.mockResolvedValue(mockResponse({ body: '{"id":1}' }))

    await expect(apiPost('/patients', { name: 'Ada' })).resolves.toEqual({ id: 1 })

    expect(fetch).toHaveBeenCalledWith(`${API_BASE}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Ada' }),
    })
  })

  it('apiPatch sends JSON with auth headers when available', async () => {
    localStorage.setItem('authToken', 'token-456')
    fetch.mockResolvedValue(mockResponse({ body: '{"updated":true}' }))

    await expect(apiPatch('/patients/1', { name: 'Grace' })).resolves.toEqual({
      updated: true,
    })

    expect(fetch).toHaveBeenCalledWith(`${API_BASE}/patients/1`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token-456',
      },
      body: JSON.stringify({ name: 'Grace' }),
    })
  })

  it('apiDelete parses an empty response body as an empty object', async () => {
    fetch.mockResolvedValue(mockResponse({ body: '' }))

    await expect(apiDelete('/patients/1')).resolves.toEqual({})
  })

  it('returns a useful parse error object for successful non-JSON responses', async () => {
    fetch.mockResolvedValue(mockResponse({ body: 'not-json' }))

    await expect(apiGet('/status')).resolves.toEqual({
      error: 'Expected JSON from API but received: not-json',
    })
  })

  it('throws an API error with status and data for non-2xx responses', async () => {
    fetch.mockResolvedValue(
      mockResponse({
        ok: false,
        status: 400,
        body: '{"error":"Invalid request","fields":["name"]}',
      }),
    )

    await expect(apiGet('/patients')).rejects.toMatchObject({
      message: 'Invalid request',
      status: 400,
      data: { error: 'Invalid request', fields: ['name'] },
    })
  })

  it('clears the session when authentication fails with 401', async () => {
    window.history.pushState({}, '', '/login')
    localStorage.setItem('authToken', 'invalid-token')
    localStorage.setItem('profile', JSON.stringify({ is_admin: false }))
    fetch.mockResolvedValue(
      mockResponse({
        ok: false,
        status: 401,
        body: '{"error":"Invalid or expired token"}',
      }),
    )

    await expect(apiGet('/profile')).rejects.toMatchObject({
      message: 'Invalid or expired token',
      status: 401,
    })

    expect(localStorage.getItem('authToken')).toBeNull()
    expect(localStorage.getItem('profile')).toBeNull()
  })

  it('preserves the session when an authenticated user is denied with 403', async () => {
    localStorage.setItem('authToken', 'token-789')
    localStorage.setItem('profile', JSON.stringify({ is_admin: false }))
    fetch.mockResolvedValue(
      mockResponse({
        ok: false,
        status: 403,
        body: '{"error":"Admin access required"}',
      }),
    )

    await expect(apiPost('/deleteAccount', { username: 'user@example.com' })).rejects.toMatchObject({
      message: 'Admin access required',
      status: 403,
    })

    expect(localStorage.getItem('authToken')).toBe('token-789')
    expect(localStorage.getItem('profile')).toBe(JSON.stringify({ is_admin: false }))
  })

  it('preserves the session when a duplicate form submission returns 409', async () => {
    localStorage.setItem('authToken', 'token-789')
    localStorage.setItem('profile', JSON.stringify({ is_admin: false }))
    fetch.mockResolvedValue(
      mockResponse({
        ok: false,
        status: 409,
        body: '{"error":"This form has already been submitted."}',
      }),
    )

    await expect(apiPost('/patients/1/forms/registration', {})).rejects.toMatchObject({
      message: 'This form has already been submitted.',
      status: 409,
    })

    expect(localStorage.getItem('authToken')).toBe('token-789')
    expect(localStorage.getItem('profile')).toBe(JSON.stringify({ is_admin: false }))
  })
})
