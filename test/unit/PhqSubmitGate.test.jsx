import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormContext } from '../../src/api/utils'
import HxPhqForm from '../../src/forms/HistoryTakingTabs/HxPhqForm'
import { getSavedData } from '../../src/services/patientData'
import { submitForm } from '../../src/api/formHelpers.jsx'

vi.mock('../../src/api/formHelpers.jsx', () => ({ submitForm: vi.fn() }))
vi.mock('src/components/form-components/FormSubmitStatusHost', () => ({
  showFormSubmitError: vi.fn(),
  showFormSubmitSuccess: vi.fn(),
}))
vi.mock('../../src/services/patientData', () => ({ getSavedData: vi.fn() }))

const NONE = '0 - Not at all'
const SEVERAL = '1 - Several days'
const HALF = '2 - More than half the days'

const renderForm = () =>
  render(
    <FormContext.Provider value={{ patientId: 7 }}>
      <HxPhqForm changeTab={vi.fn()} nextTab={1} />
    </FormContext.Provider>,
  )

// Fill everything the form always requires, except PHQ9.
const fillRequiredExceptPhq9 = async (user, { phq1, phq2 }) => {
  const pick = async (name, value) => {
    const el = document.querySelector(`input[name="${name}"][value="${value}"]`)
    await user.click(el)
  }
  await pick('PHQ1', phq1)
  await pick('PHQ2', phq2)
  await pick('GAD1', NONE)
  await pick('GAD2', NONE)
  await pick('PHQ11', 'No')
}

describe('History Taking PHQ: can you submit without PHQ9?', () => {
  beforeEach(() => {
    submitForm.mockResolvedValue({ result: true })
    getSavedData.mockResolvedValue({})
  })

  it('BELOW the cutoff (PHQ-2 = 2): submits fine, PHQ9 never asked', async () => {
    const user = userEvent.setup()
    renderForm()
    await screen.findAllByRole('radio', { name: NONE })

    await fillRequiredExceptPhq9(user, { phq1: SEVERAL, phq2: SEVERAL })
    expect(screen.queryByText(/PHQ9\. Thoughts/)).toBeNull()

    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(submitForm).toHaveBeenCalledTimes(1)
  })

  it('AT the cutoff (PHQ-2 = 3): submission is BLOCKED until PHQ9 is answered', async () => {
    const user = userEvent.setup()
    renderForm()
    await screen.findAllByRole('radio', { name: NONE })

    await fillRequiredExceptPhq9(user, { phq1: HALF, phq2: SEVERAL })
    expect(await screen.findByText(/PHQ9\. Thoughts/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(submitForm).not.toHaveBeenCalled()

    // Answering PHQ9 unblocks it.
    await user.click(document.querySelector(`input[name="PHQ9"][value="${NONE}"]`))
    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(submitForm).toHaveBeenCalledTimes(1)
  })
})
