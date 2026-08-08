import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegForm from '../../src/forms/RegForm'
import { submitForm } from '../../src/api/formHelpers.jsx'
import {
  showFormSubmitError,
  showFormSubmitSuccess,
} from '../../src/components/form-components/FormSubmitStatusHost'
import { getPatientFormDataStrict } from '../../src/services/patientData'
import { getPatientPreRegistrationPrefillStrict } from '../../src/services/preRegistrations'
import { currentRoute, renderFormWithContext } from '../utils/formTestHarness'
import { validRegistration } from '../utils/coreFormFixtures'

vi.mock('../../src/api/formHelpers.jsx', () => ({ submitForm: vi.fn() }))
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
vi.mock('../../src/components/form-components/FormSubmitStatusHost', () => ({
  showFormSubmitError: vi.fn(),
  showFormSubmitSuccess: vi.fn(),
}))
vi.mock('../../src/services/patientData', () => ({
  getPatientFormDataStrict: vi.fn(),
}))
vi.mock('../../src/services/preRegistrations', () => ({
  getPatientPreRegistrationPrefillStrict: vi.fn(),
}))

function renderRegistration(context = {}) {
  return renderFormWithContext(<RegForm />, { context })
}

describe('RegForm lifecycle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getPatientFormDataStrict.mockResolvedValue(validRegistration)
    getPatientPreRegistrationPrefillStrict.mockResolvedValue(null)
    submitForm.mockResolvedValue({ result: true, data: {}, qNum: 7 })
    showFormSubmitSuccess.mockResolvedValue(undefined)
  })

  it('hydrates saved registration data before enabling submission', async () => {
    renderRegistration({ updatePatientInfo: vi.fn() })

    expect(screen.queryByRole('button', { name: 'Submit' })).not.toBeInTheDocument()
    expect(await screen.findByDisplayValue('AL')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled()
  })

  it('falls back to pre-registration and displays mapping notices', async () => {
    getPatientFormDataStrict.mockResolvedValue(null)
    getPatientPreRegistrationPrefillStrict.mockResolvedValue({
      registrationData: validRegistration,
      nameMappingWarnings: ['Verify mapped initials'],
      mappingIssues: ['registrationQ12'],
    })

    renderRegistration({ updatePatientInfo: vi.fn() })

    expect(await screen.findByText(/Loaded from pre-registration/)).toBeInTheDocument()
    expect(screen.getByText('Verify mapped initials')).toBeInTheDocument()
    expect(screen.getByText(/Some answers could not be prefilled/)).toBeInTheDocument()
    expect(getPatientPreRegistrationPrefillStrict).toHaveBeenCalledWith(7)
  })

  it('retries a failed load without exposing a blank form', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    getPatientFormDataStrict
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(validRegistration)

    const user = userEvent.setup()
    renderRegistration({ updatePatientInfo: vi.fn() })

    expect(await screen.findByText(/Unable to load registration data/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Submit' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Try Again' }))
    expect(await screen.findByDisplayValue('AL')).toBeInTheDocument()
    expect(getPatientFormDataStrict).toHaveBeenCalledTimes(2)
  })

  it('blocks an incomplete registration before calling the submission service', async () => {
    getPatientFormDataStrict.mockResolvedValue(null)
    const user = userEvent.setup()
    renderRegistration({ updatePatientInfo: vi.fn() })

    await user.click(await screen.findByRole('button', { name: 'Submit' }))

    expect(
      await screen.findByText('Please fill in all required fields correctly.'),
    ).toBeInTheDocument()
    expect(submitForm).not.toHaveBeenCalled()
  })

  it('submits transformed registration data, updates context, and navigates after success', async () => {
    const updatePatientInfo = vi.fn()
    const user = userEvent.setup()
    renderRegistration({ updatePatientInfo })

    await user.click(await screen.findByRole('button', { name: 'Submit' }))

    await waitFor(() => expect(submitForm).toHaveBeenCalledTimes(1))
    expect(submitForm).toHaveBeenCalledWith(
      expect.objectContaining({
        registrationQ2: 'AL',
        registrationQ3: expect.any(Date),
        registrationQ4: expect.any(Number),
      }),
      7,
      'registrationForm',
    )
    expect(showFormSubmitSuccess).toHaveBeenCalledTimes(1)
    expect(updatePatientInfo).toHaveBeenCalledWith({ queueNo: 7 })
    await waitFor(() => expect(currentRoute()).toHaveTextContent('/app/dashboard'))
  })

  it('preserves the form and permits retry after a failed submission', async () => {
    submitForm
      .mockResolvedValueOnce({ result: false, error: 'save failed' })
      .mockResolvedValueOnce({ result: true, data: {}, qNum: 7 })
    const updatePatientInfo = vi.fn()
    const user = userEvent.setup()
    renderRegistration({ updatePatientInfo })

    await user.click(await screen.findByRole('button', { name: 'Submit' }))
    await waitFor(() =>
      expect(showFormSubmitError).toHaveBeenCalledWith('Unsuccessful. save failed'),
    )
    expect(currentRoute()).toHaveTextContent('/station')
    expect(screen.getByDisplayValue('AL')).toBeInTheDocument()
    expect(updatePatientInfo).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Submit' }))
    await waitFor(() => expect(submitForm).toHaveBeenCalledTimes(2))
  })
})
