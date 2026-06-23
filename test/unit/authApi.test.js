import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiPost } from '../../src/apiClient'
import { deleteAccount, login, resetPassword, signup } from '../../src/api/authApi'

vi.mock('../../src/apiClient', () => ({
  apiPost: vi.fn(),
}))

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('posts login credentials with account type', () => {
    login('ada@example.com', 'secret', 'admin')

    expect(apiPost).toHaveBeenCalledWith('/handleLogin', {
      email: 'ada@example.com',
      password: 'secret',
      type: 'admin',
    })
  })

  it('posts signup credentials', () => {
    signup('ada@example.com', 'secret')

    expect(apiPost).toHaveBeenCalledWith('/handleSignup', {
      email: 'ada@example.com',
      password: 'secret',
    })
  })

  it('posts delete account requests', () => {
    deleteAccount('ada@example.com')

    expect(apiPost).toHaveBeenCalledWith('/deleteAccount', {
      username: 'ada@example.com',
    })
  })

  it('posts password reset requests', () => {
    resetPassword('ada@example.com', 'new-secret')

    expect(apiPost).toHaveBeenCalledWith('/resetPassword', {
      username: 'ada@example.com',
      newPassword: 'new-secret',
    })
  })
})
