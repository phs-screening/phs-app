import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getCurrentProfile } from '../../src/api/profilesApi'
import {
  getName,
  getProfile,
  isAdmin,
  isLoggedin,
  logOut,
} from '../../src/services/authSession'

vi.mock('../../src/api/profilesApi', () => ({
  getCurrentProfile: vi.fn(),
}))

const createJwt = (payload) => {
  const encode = (value) =>
    btoa(JSON.stringify(value)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')

  return `${encode({ alg: 'none', typ: 'JWT' })}.${encode(payload)}.signature`
}

describe('authSession', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('gets a display name from a profile', () => {
    expect(getName()).toBe('')
    expect(getName({ email: 'ada@example.com' })).toBe('ada@example.com')
    expect(getName({ name: 'Ada', email: 'ada@example.com' })).toBe('Ada')
    expect(getName({ name: '', email: 'ada@example.com' })).toBe('')
  })

  it('detects login state from localStorage', () => {
    expect(isLoggedin()).toBe(false)

    localStorage.setItem('authToken', 'token-123')

    expect(isLoggedin()).toBe(true)
  })

  it('logs out by removing auth session values', async () => {
    localStorage.setItem('authToken', 'token-123')
    localStorage.setItem('profile', '{"name":"Ada"}')
    localStorage.setItem('selectedPatient', '{"patientId":123,"patientInfo":{"queueNo":123}}')

    await logOut()

    expect(localStorage.getItem('authToken')).toBeNull()
    expect(localStorage.getItem('profile')).toBeNull()
    expect(localStorage.getItem('selectedPatient')).toBeNull()
  })

  it('clears selected patient when an expired token is detected', () => {
    localStorage.setItem('authToken', createJwt({ exp: Math.floor(Date.now() / 1000) - 60 }))
    localStorage.setItem('profile', '{"name":"Ada"}')
    localStorage.setItem('selectedPatient', '{"patientId":123,"patientInfo":{"queueNo":123}}')

    expect(isLoggedin()).toBe(false)
    expect(localStorage.getItem('authToken')).toBeNull()
    expect(localStorage.getItem('profile')).toBeNull()
    expect(localStorage.getItem('selectedPatient')).toBeNull()
  })

  it('returns null for getProfile when logged out', async () => {
    await expect(getProfile()).resolves.toBeNull()

    expect(getCurrentProfile).not.toHaveBeenCalled()
  })

  it('returns the current user profile when logged in', async () => {
    localStorage.setItem('authToken', 'token-123')
    getCurrentProfile.mockResolvedValue({ user: { name: 'Ada' } })

    await expect(getProfile()).resolves.toEqual({ name: 'Ada' })
  })

  it('returns null when profile loading fails', async () => {
    localStorage.setItem('authToken', 'token-123')
    getCurrentProfile.mockRejectedValue(new Error('Nope'))

    await expect(getProfile()).resolves.toBeNull()
  })

  it('detects admin profiles', async () => {
    localStorage.setItem('authToken', 'token-123')
    getCurrentProfile.mockResolvedValueOnce({ user: { is_admin: true } })
    await expect(isAdmin()).resolves.toBe(true)

    getCurrentProfile.mockResolvedValueOnce({ user: { is_admin: false } })
    await expect(isAdmin()).resolves.toBe(false)
  })
})
