import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiGet, apiPost } from '../../src/apiClient'
import {
  createPatient,
  getPatient,
  getPatientNames,
  searchPatientsByInitials,
} from '../../src/api/patientsApi'

vi.mock('../../src/apiClient', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
}))

describe('patientsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a patient with the supplied payload', () => {
    const payload = { initials: 'AL', age: 42 }

    createPatient(payload)

    expect(apiPost).toHaveBeenCalledWith('/patients', payload)
  })

  it('gets a patient with an encoded patient id', () => {
    getPatient('patient/7')

    expect(apiGet).toHaveBeenCalledWith('/patients/patient%2F7')
  })

  it('gets patient names with default pagination', () => {
    getPatientNames()

    expect(apiGet).toHaveBeenCalledWith('/patients/names?page=1&limit=20')
  })

  it('trims search and applies custom pagination when getting patient names', () => {
    getPatientNames({ q: '  Ada  ', page: 2, limit: 5 })

    expect(apiGet).toHaveBeenCalledWith('/patients/names?q=Ada&page=2&limit=5')
  })

  it('omits blank search when getting patient names', () => {
    getPatientNames({ q: '   ', page: 3, limit: 10 })

    expect(apiGet).toHaveBeenCalledWith('/patients/names?page=3&limit=10')
  })

  it('searches patients by encoded initials', () => {
    searchPatientsByInitials('A/L')

    expect(apiGet).toHaveBeenCalledWith('/patients/search?initials=A%2FL')
  })
})
