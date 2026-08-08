import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TriageForm from '../../src/forms/TriageForm'
import { getPatientFormDataStrict } from '../../src/services/patientData'
import { submitForm } from '../../src/api/formHelpers.jsx'
import {
  showFormSubmitError,
  showFormSubmitSuccess,
} from '../../src/components/form-components/FormSubmitStatusHost'
import { currentRoute, createDeferred, renderFormWithContext } from '../utils/formTestHarness'
import { validTriage } from '../utils/coreFormFixtures'

vi.mock('../../src/api/formHelpers.jsx', () => ({
  formatBmi: vi.fn(() => null),
  submitForm: vi.fn(),
}))

vi.mock('../../src/components/form-components/FormSubmitStatusHost', () => ({
  showFormSubmitError: vi.fn(),
  showFormSubmitSuccess: vi.fn(),
}))

vi.mock('../../src/services/patientData', () => ({
  getPatientFormDataStrict: vi.fn(),
}))

function renderTriageForm() {
  return renderFormWithContext(<TriageForm />)
}

describe('TriageForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getPatientFormDataStrict.mockResolvedValue(null)
    submitForm.mockResolvedValue({ result: true })
    showFormSubmitSuccess.mockResolvedValue(undefined)
  })

  it('renders the new neck circumference and SpO2 fields', async () => {
    renderTriageForm()

    expect(await screen.findByLabelText('Triage Q15')).toBeInTheDocument()
    expect(screen.getByLabelText('Triage Q16')).toBeInTheDocument()
  })

  it('shows the Comm member warning only when Q9 is Yes', async () => {
    const user = userEvent.setup()
    renderTriageForm()

    await screen.findByLabelText('Triage Q15')
    expect(screen.queryByText('Please inform a Comm member immediately.')).not.toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'Yes' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Please inform a Comm member immediately.',
    )
  })

  it('hydrates saved measurements before enabling submission', async () => {
    const load = createDeferred()
    getPatientFormDataStrict.mockReturnValue(load.promise)
    renderTriageForm()

    expect(screen.queryByRole('button', { name: 'Submit' })).not.toBeInTheDocument()
    load.resolve(validTriage)

    expect(await screen.findByLabelText('Triage Q15')).toHaveValue(38)
    expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled()
  })

  it('retries a failed triage load without exposing an empty submit action', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    getPatientFormDataStrict
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(validTriage)
    const user = userEvent.setup()
    renderTriageForm()

    expect(await screen.findByText(/Unable to load triage data/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Submit' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Try Again' }))
    expect(await screen.findByLabelText('Triage Q15')).toHaveValue(38)
    expect(getPatientFormDataStrict).toHaveBeenCalledTimes(2)
  })

  it('calculates two-reading averages and completes the submission lifecycle', async () => {
    getPatientFormDataStrict.mockResolvedValue(validTriage)
    const user = userEvent.setup()
    renderTriageForm()

    await user.click(await screen.findByRole('button', { name: 'Submit' }))

    await waitFor(() => expect(submitForm).toHaveBeenCalledTimes(1))
    expect(submitForm).toHaveBeenCalledWith(
      expect.objectContaining({ triageQ7: 135, triageQ8: 85, triageQHRAvg: 75 }),
      7,
      'triageForm',
    )
    expect(showFormSubmitSuccess).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(currentRoute()).toHaveTextContent('/app/dashboard'))
  })

  it('uses the closest pair when a third reading is present', async () => {
    getPatientFormDataStrict.mockResolvedValue({
      ...validTriage,
      triageQ5: 132,
      triageQ6: 82,
      triageQHR3: 79,
    })
    const user = userEvent.setup()
    renderTriageForm()

    await user.click(await screen.findByRole('button', { name: 'Submit' }))

    await waitFor(() =>
      expect(submitForm).toHaveBeenCalledWith(
        expect.objectContaining({ triageQ7: 131, triageQ8: 81, triageQHRAvg: 80 }),
        7,
        'triageForm',
      ),
    )
  })

  it('stays on the form with its values after a failed submission', async () => {
    getPatientFormDataStrict.mockResolvedValue(validTriage)
    submitForm.mockResolvedValue({ result: false, error: 'save failed' })
    const user = userEvent.setup()
    renderTriageForm()

    await user.click(await screen.findByRole('button', { name: 'Submit' }))

    await waitFor(() =>
      expect(showFormSubmitError).toHaveBeenCalledWith('Unsuccessful. save failed'),
    )
    expect(currentRoute()).toHaveTextContent('/station')
    expect(screen.getByLabelText('Triage Q15')).toHaveValue(38)
    expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled()
  })
})
