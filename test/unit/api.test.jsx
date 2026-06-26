import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPatient } from '../../src/api/patientsApi'
import { submitPatientForm } from '../../src/api/formsApi'
import { submitForm } from '../../src/api/api'

vi.mock('../../src/api/patientsApi', () => ({
  createPatient: vi.fn(),
}))

vi.mock('../../src/api/formsApi', () => ({
  submitPatientForm: vi.fn(),
}))

vi.mock('../../src/reports/doctorPdf', () => ({
  generateDoctorPdf: vi.fn(),
}))

vi.mock('../../src/reports/formAPdf', () => ({
  generateFormAPdf: vi.fn(),
}))

vi.mock('../../src/reports/patientReportPdf', () => ({
  addBmi: vi.fn(),
  addBloodPressure: vi.fn(),
  addFollowUp: vi.fn(),
  addMemos: vi.fn(),
  addOtherScreeningModularities: vi.fn(),
  addRecommendation: vi.fn(),
  calculateY: vi.fn(),
  followUpWith: vi.fn(),
  generate_pdf: vi.fn(),
  kNewlines: '\n',
  patient: {},
}))

vi.mock('../../src/reports/patientReportPdfUpdated', () => ({
  bloodPressureSection: vi.fn(),
  bmiSection: vi.fn(),
  followUpSection: vi.fn(),
  generate_pdf_updated: vi.fn(),
  memoSection: vi.fn(),
  otherScreeningModularitiesSection: vi.fn(),
  recommendationSection: vi.fn(),
  temperatureSection: vi.fn(),
}))

const registrationArgs = {
  registrationQ2: '  AL  ',
  registrationQ4: '42',
  registrationQ5: 'Female',
  registrationQ14: '  Mandarin  ',
}

describe('api submitForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a patient before submitting a form when patient id is -1', async () => {
    createPatient.mockResolvedValue({
      result: true,
      data: { queueNo: 17 },
    })
    submitPatientForm.mockResolvedValue({ result: true })

    await expect(submitForm(registrationArgs, -1, 'registrationForm')).resolves.toEqual({
      result: true,
      data: {
        gender: 'Female',
        initials: 'AL',
        age: 42,
        preferredLanguage: 'Mandarin',
      },
      qNum: 17,
    })

    expect(createPatient).toHaveBeenCalledWith({
      gender: 'Female',
      initials: 'AL',
      age: 42,
      preferredLanguage: 'Mandarin',
    })
    expect(submitPatientForm).toHaveBeenCalledWith(17, 'registration', registrationArgs)
  })

  it('creates a patient before submitting a form when patient id is null', async () => {
    createPatient.mockResolvedValue({
      result: true,
      data: { queueNo: 23 },
    })
    submitPatientForm.mockResolvedValue({ result: true })

    await expect(submitForm(registrationArgs, null, 'triageForm')).resolves.toMatchObject({
      result: true,
      qNum: 23,
    })

    expect(createPatient).toHaveBeenCalledTimes(1)
    expect(submitPatientForm).toHaveBeenCalledWith(23, 'triage', registrationArgs)
  })

  it('submits a form for an existing patient without creating a patient', async () => {
    submitPatientForm.mockResolvedValue({ result: true })

    await expect(submitForm(registrationArgs, 7, 'doctorConsultForm')).resolves.toEqual({
      result: true,
      data: {
        gender: 'Female',
        initials: '  AL  ',
        age: '42',
        preferredLanguage: '  Mandarin  ',
      },
      qNum: 7,
    })

    expect(createPatient).not.toHaveBeenCalled()
    expect(submitPatientForm).toHaveBeenCalledWith(7, 'doctorConsult', registrationArgs)
  })

  it('returns a failure when patient creation fails', async () => {
    createPatient.mockResolvedValue({ result: false })

    await expect(submitForm(registrationArgs, -1, 'registrationForm')).resolves.toEqual({
      result: false,
      error: 'Failed to create patient',
    })

    expect(submitPatientForm).not.toHaveBeenCalled()
  })

  it('returns a failure when form saving fails', async () => {
    createPatient.mockResolvedValue({
      result: true,
      data: { queueNo: 17 },
    })
    submitPatientForm.mockResolvedValue({ result: false })

    await expect(submitForm(registrationArgs, -1, 'registrationForm')).resolves.toEqual({
      result: false,
      error: 'Failed to save form',
    })
  })

  it('returns a failure message when an API call throws', async () => {
    submitPatientForm.mockRejectedValue(new Error('Backend unavailable'))

    await expect(submitForm(registrationArgs, 7, 'registrationForm')).resolves.toEqual({
      result: false,
      error: 'Backend unavailable',
    })
  })

  it('deduplicates concurrent submissions with the same patient and form key', async () => {
    let resolveSave
    const savePromise = new Promise((resolve) => {
      resolveSave = resolve
    })
    submitPatientForm.mockReturnValue(savePromise)

    const firstSubmission = submitForm(registrationArgs, 7, 'registrationForm')
    const duplicateSubmission = submitForm(registrationArgs, 7, 'registrationForm')

    expect(submitPatientForm).toHaveBeenCalledTimes(1)

    resolveSave({ result: true })

    await expect(firstSubmission).resolves.toEqual({
      result: true,
      data: {
        gender: 'Female',
        initials: '  AL  ',
        age: '42',
        preferredLanguage: '  Mandarin  ',
      },
      qNum: 7,
    })
    await expect(duplicateSubmission).resolves.toEqual({
      result: true,
      data: {
        gender: 'Female',
        initials: '  AL  ',
        age: '42',
        preferredLanguage: '  Mandarin  ',
      },
      qNum: 7,
    })

    submitPatientForm.mockResolvedValue({ result: true })
    await submitForm(registrationArgs, 7, 'registrationForm')

    expect(submitPatientForm).toHaveBeenCalledTimes(2)
  })
})
