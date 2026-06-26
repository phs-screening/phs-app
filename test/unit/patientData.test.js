import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getPatientForm } from '../../src/api/formsApi'
import { getPatient, getPatientNames, searchPatientsByInitials } from '../../src/api/patientsApi'
import {
  findPatientByInitials,
  findPatientByInitialsStrict,
  getAllPatientNames,
  getAllPatientNamesStrict,
  getPatientFormData,
  getPatientFormDataStrict,
  getPatientNamesList,
  getPatientNamesListStrict,
  getPatientRecord,
  getPatientRecordStrict,
  getPreRegDataById,
  getPreRegDataByIdStrict,
  getPreRegDataByName,
  getPreRegDataByNameStrict,
  getSavedData,
  getSavedPatientData,
} from '../../src/services/patientData'
import { withRetry } from '../../src/utils/retryRequest'

vi.mock('../../src/api/patientsApi', () => ({
  getPatient: vi.fn(),
  getPatientNames: vi.fn(),
  searchPatientsByInitials: vi.fn(),
}))

vi.mock('../../src/api/formsApi', () => ({
  getPatientForm: vi.fn(),
}))

vi.mock('../../src/utils/retryRequest', () => ({
  withRetry: vi.fn(),
}))

describe('patientData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    withRetry.mockImplementation((fn) => fn())
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('loads patient records strictly through withRetry', async () => {
    getPatient.mockResolvedValue({ data: { queueNo: 7 } })

    await expect(getPatientRecordStrict(7)).resolves.toEqual({ queueNo: 7 })

    expect(withRetry).toHaveBeenCalledTimes(1)
    expect(getPatient).toHaveBeenCalledWith(7)
  })

  it('returns null from strict patient lookup when data is missing', async () => {
    getPatient.mockResolvedValue({})

    await expect(getPatientRecordStrict(7)).resolves.toBeNull()
  })

  it('returns safe fallbacks for non-strict patient loading failures', async () => {
    getPatient.mockRejectedValue(new Error('Backend unavailable'))

    await expect(getPatientRecord(7)).resolves.toEqual({})

    expect(console.error).toHaveBeenCalledWith(
      'Failed to load patient record 7:',
      expect.any(Error)
    )
  })

  it('loads patient names with strict and safe variants', async () => {
    getPatientNames.mockResolvedValueOnce({ data: [{ initials: 'AL' }] })
    await expect(getPatientNamesListStrict({ q: 'A' })).resolves.toEqual([{ initials: 'AL' }])

    getPatientNames.mockResolvedValueOnce({})
    await expect(getPatientNamesList({ q: 'B' })).resolves.toEqual([])

    getPatientNames.mockRejectedValueOnce(new Error('No names'))
    await expect(getPatientNamesList({ q: 'C' })).resolves.toEqual([])
  })

  it('finds patients by initials with strict and safe variants', async () => {
    searchPatientsByInitials.mockResolvedValueOnce({ data: { initials: 'AL' } })
    await expect(findPatientByInitialsStrict('AL')).resolves.toEqual({ initials: 'AL' })

    searchPatientsByInitials.mockResolvedValueOnce({})
    await expect(findPatientByInitials('ZZ')).resolves.toEqual({})

    searchPatientsByInitials.mockRejectedValueOnce(new Error('No patient'))
    await expect(findPatientByInitials('NO')).resolves.toEqual({})
  })

  it('loads patient form data with normalized form keys', async () => {
    getPatientForm.mockResolvedValue({ data: { submitted: true } })

    await expect(getPatientFormData(7, 'registrationForm')).resolves.toEqual({
      submitted: true,
    })
    await expect(getPatientFormDataStrict(7, 'registrationForm')).resolves.toEqual({
      submitted: true,
    })

    expect(getPatientForm).toHaveBeenCalledWith(7, 'registration')
  })

  it('returns safe fallbacks for missing or failed form data', async () => {
    getPatientForm.mockResolvedValueOnce({})
    await expect(getPatientFormData(7, 'triageForm')).resolves.toEqual({})

    getPatientForm.mockResolvedValueOnce({})
    await expect(getPatientFormDataStrict(7, 'triageForm')).resolves.toBeNull()

    getPatientForm.mockRejectedValueOnce(new Error('No form'))
    await expect(getPatientFormData(7, 'triageForm')).resolves.toEqual({})
  })

  it('keeps the compatibility aliases wired to the right loaders', async () => {
    getPatient.mockResolvedValue({ data: { queueNo: 7 } })
    await expect(getSavedPatientData(7, 'patients')).resolves.toEqual({ queueNo: 7 })

    getPatientForm.mockResolvedValue({ data: { submitted: true } })
    await expect(getSavedPatientData(7, 'triageForm')).resolves.toEqual({ submitted: true })
    await expect(getSavedData(7, 'triageForm')).resolves.toEqual({ submitted: true })
  })

  it('routes pre-registration lookups by resource name', async () => {
    getPatient.mockResolvedValue({ data: { queueNo: 7 } })
    searchPatientsByInitials.mockResolvedValue({ data: { initials: 'AL' } })
    getPatientNames.mockResolvedValue({ data: [{ initials: 'AL' }] })

    await expect(getPreRegDataById(7, 'patients')).resolves.toEqual({ queueNo: 7 })
    await expect(getPreRegDataByIdStrict(7, 'patients')).resolves.toEqual({ queueNo: 7 })
    await expect(getPreRegDataByName('AL', 'patients')).resolves.toEqual({ initials: 'AL' })
    await expect(getPreRegDataByNameStrict('AL', 'patients')).resolves.toEqual({
      initials: 'AL',
    })
    await expect(getAllPatientNames('patients', { q: 'A' })).resolves.toEqual([
      { initials: 'AL' },
    ])
    await expect(getAllPatientNamesStrict('patients', { q: 'A' })).resolves.toEqual([
      { initials: 'AL' },
    ])

    await expect(getPreRegDataByName('AL', 'triageForm')).resolves.toEqual({})
    await expect(getPreRegDataByNameStrict('AL', 'triageForm')).resolves.toBeNull()
    await expect(getAllPatientNames('triageForm')).resolves.toEqual([])
    await expect(getAllPatientNamesStrict('triageForm')).resolves.toEqual([])
  })
})
