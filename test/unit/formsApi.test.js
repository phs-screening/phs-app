import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiGet, apiPost } from '../../src/apiClient'
import { getFormsRegistry, getPatientForm, submitPatientForm } from '../../src/api/formsApi'

vi.mock('../../src/apiClient', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
}))

describe('formsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('gets the forms registry', () => {
    getFormsRegistry()

    expect(apiGet).toHaveBeenCalledWith('/forms/registry')
  })

  it('gets a patient form with encoded path values', () => {
    getPatientForm('patient/7', 'doctor consult')

    expect(apiGet).toHaveBeenCalledWith('/patients/patient%2F7/forms/doctor%20consult')
  })

  it('submits patient form data with encoded path values', () => {
    const data = { field: 'value' }

    submitPatientForm('patient/7', 'doctor consult', data)

    expect(apiPost).toHaveBeenCalledWith('/patients/patient%2F7/forms/doctor%20consult', {
      data,
    })
  })
})
