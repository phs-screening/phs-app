import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ArthritisForm from '../../src/forms/ArthritisForm'
import HsgForm from '../../src/forms/HsgForm'
import { submitForm } from '../../src/api/formHelpers.jsx'
import {
  showFormSubmitError,
  showFormSubmitSuccess,
} from '../../src/components/form-components/FormSubmitStatusHost'
import { getPatientFormDataStrict } from '../../src/services/patientData'
import { currentRoute, createDeferred, renderFormWithContext } from '../utils/formTestHarness'

vi.mock('../../src/api/formHelpers.jsx', () => ({ submitForm: vi.fn() }))
vi.mock('../../src/components/form-components/FormSubmitStatusHost', () => ({
  showFormSubmitError: vi.fn(),
  showFormSubmitSuccess: vi.fn(),
}))
vi.mock('../../src/services/patientData', () => ({
  getPatientFormDataStrict: vi.fn(),
}))

describe('high-reach station form lifecycles', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getPatientFormDataStrict.mockResolvedValue(null)
    submitForm.mockResolvedValue({ result: true })
    showFormSubmitSuccess.mockResolvedValue(undefined)
  })

  it('does not expose the Arthritis form until saved data is hydrated', async () => {
    const load = createDeferred()
    getPatientFormDataStrict.mockReturnValue(load.promise)
    renderFormWithContext(<ArthritisForm />)

    expect(screen.getByRole('progressbar', { name: 'Loading arthritis data' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Submit' })).not.toBeInTheDocument()

    load.resolve({ NAF1: 'Yes' })
    expect(await screen.findByRole('radio', { name: 'Yes' })).toBeChecked()
  })

  it('validates, submits, and navigates from Arthritis', async () => {
    const user = userEvent.setup()
    renderFormWithContext(<ArthritisForm />)

    await user.click(await screen.findByRole('button', { name: 'Submit' }))
    expect(await screen.findByText('Please fill in all required fields correctly.')).toBeInTheDocument()
    expect(submitForm).not.toHaveBeenCalled()

    await user.click(screen.getByRole('radio', { name: 'No' }))
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() =>
      expect(submitForm).toHaveBeenCalledWith({ NAF1: 'No' }, 7, 'arthritisForm'),
    )
    expect(showFormSubmitSuccess).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(currentRoute()).toHaveTextContent('/app/dashboard'))
  })

  it('keeps Arthritis retryable after an unexpected submission rejection', async () => {
    submitForm.mockRejectedValueOnce(new Error('network lost'))
    getPatientFormDataStrict.mockResolvedValue({ NAF1: 'Yes' })
    const user = userEvent.setup()
    renderFormWithContext(<ArthritisForm />)

    await user.click(await screen.findByRole('button', { name: 'Submit' }))
    await waitFor(() =>
      expect(showFormSubmitError).toHaveBeenCalledWith('Unsuccessful. network lost'),
    )
    expect(currentRoute()).toHaveTextContent('/station')
    expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled()
    expect(screen.getByRole('radio', { name: 'Yes' })).toBeChecked()
  })

  it('hydrates every Healthier SG response and shows the reason only for declined sign-up', async () => {
    getPatientFormDataStrict.mockResolvedValue({
      HSG1: 'No, I did not sign up for HSG',
      HSG2: 'Needs more time',
    })
    const user = userEvent.setup()
    renderFormWithContext(<HsgForm />)

    expect(
      await screen.findByRole('radio', { name: 'No, I did not sign up for HSG' }),
    ).toBeChecked()
    expect(screen.getByDisplayValue('Needs more time')).toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: 'No, I am already on HSG' }))
    expect(screen.queryByDisplayValue('Needs more time')).not.toBeInTheDocument()
    await user.click(screen.getByRole('radio', { name: 'Yes, I signed up for HSG today' }))
    expect(screen.queryByLabelText('HSG2')).not.toBeInTheDocument()
  })

  it('submits Healthier SG once while pending and navigates only after success', async () => {
    getPatientFormDataStrict.mockResolvedValue({ HSG1: 'Yes, I signed up for HSG today' })
    const save = createDeferred()
    submitForm.mockReturnValue(save.promise)
    const user = userEvent.setup()
    renderFormWithContext(<HsgForm />)

    await user.click(await screen.findByRole('button', { name: 'Submit' }))
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    expect(submitForm).toHaveBeenCalledTimes(1)
    expect(currentRoute()).toHaveTextContent('/station')

    save.resolve({ result: true })
    await waitFor(() => expect(currentRoute()).toHaveTextContent('/app/dashboard'))
    expect(showFormSubmitSuccess).toHaveBeenCalledTimes(1)
  })

  it('retries Healthier SG loading after a visible failure', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    getPatientFormDataStrict
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce({ HSG1: 'No, I am already on HSG' })
    const user = userEvent.setup()
    renderFormWithContext(<HsgForm />)

    expect(await screen.findByText(/Unable to load Healthier SG data/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Try Again' }))
    expect(
      await screen.findByRole('radio', { name: 'No, I am already on HSG' }),
    ).toBeChecked()
  })
})
