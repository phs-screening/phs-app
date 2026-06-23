import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiGet } from '../../src/apiClient'
import {
  getCurrentProfile,
  getProfiles,
  getVolunteerProfileCount,
  getVolunteerProfiles,
} from '../../src/api/profilesApi'

vi.mock('../../src/apiClient', () => ({
  apiGet: vi.fn(),
}))

describe('profilesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('gets the current profile', () => {
    getCurrentProfile()

    expect(apiGet).toHaveBeenCalledWith('/profile')
  })

  it('gets all profiles', () => {
    getProfiles()

    expect(apiGet).toHaveBeenCalledWith('/profiles')
  })

  it('gets volunteer profiles', () => {
    getVolunteerProfiles()

    expect(apiGet).toHaveBeenCalledWith('/profiles/volunteers')
  })

  it('gets volunteer profile count', () => {
    getVolunteerProfileCount()

    expect(apiGet).toHaveBeenCalledWith('/profiles/volunteers/count')
  })
})
