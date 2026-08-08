import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegForm from '../../src/forms/RegForm'
import { submitPatientForm } from '../../src/api/formsApi'
import { createPatient } from '../../src/api/patientsApi'
import { getPatientFormDataStrict } from '../../src/services/patientData'
import { getPatientPreRegistrationPrefillStrict } from '../../src/services/preRegistrations'
import { showFormSubmitSuccess } from '../../src/components/form-components/FormSubmitStatusHost'
import { currentRoute, renderFormWithContext } from '../utils/formTestHarness'
import { validRegistration } from '../utils/coreFormFixtures'

vi.mock('../../src/api/formsApi', () => ({ submitPatientForm: vi.fn() }))
vi.mock('../../src/api/patientsApi', () => ({ createPatient: vi.fn() }))
vi.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  LocalizationProvider: ({ children }) => children,
}))
vi.mock('@mui/x-date-pickers/internals/demo', () => ({
  DemoContainer: ({ children }) => children,
}))
vi.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: () => <input aria-label='Birthday' readOnly />,
}))
vi.mock('@mui/x-date-pickers/AdapterDayjs', () => ({ AdapterDayjs: vi.fn() }))
vi.mock('../../src/services/patientData', () => ({
  getPatientFormDataStrict: vi.fn(),
}))
vi.mock('../../src/services/preRegistrations', () => ({
  getPatientPreRegistrationPrefillStrict: vi.fn(),
}))
vi.mock('../../src/components/form-components/FormSubmitStatusHost', () => ({
  showFormSubmitError: vi.fn(),
  showFormSubmitSuccess: vi.fn(),
}))

describe('core form submission integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getPatientFormDataStrict.mockResolvedValue(validRegistration)
    getPatientPreRegistrationPrefillStrict.mockResolvedValue(null)
    submitPatientForm.mockResolvedValue({ result: true })
    showFormSubmitSuccess.mockResolvedValue(undefined)
  })

  it('persists a rendered registration through the real submission helper', async () => {
    const updatePatientInfo = vi.fn()
    const user = userEvent.setup()
    renderFormWithContext(<RegForm />, { context: { updatePatientInfo } })

    await user.click(await screen.findByRole('button', { name: 'Submit' }))

    await waitFor(() => expect(submitPatientForm).toHaveBeenCalledTimes(1))
    expect(submitPatientForm).toHaveBeenCalledWith(
      7,
      'registration',
      expect.objectContaining({
        registrationQ2: 'AL',
        registrationQ3: expect.any(Date),
        registrationQ4: expect.any(Number),
      }),
    )
    expect(createPatient).not.toHaveBeenCalled()
    expect(updatePatientInfo).toHaveBeenCalledWith(
      expect.objectContaining({
        queueNo: 7,
        initials: 'AL',
        gender: 'Female',
        preferredLanguage: 'English',
      }),
    )
    await waitFor(() => expect(currentRoute()).toHaveTextContent('/app/dashboard'))
  })
})
