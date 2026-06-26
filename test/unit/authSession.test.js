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

    await logOut()

    expect(localStorage.getItem('authToken')).toBeNull()
    expect(localStorage.getItem('profile')).toBeNull()
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
