import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormContext } from '../../src/api/utils'
import GeriPhqForm from '../../src/forms/GeriCognitiveTabs/GeriPhqForm'
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
      <GeriPhqForm changeTab={vi.fn()} nextTab={1} />
    </FormContext.Provider>,
  )

describe('Geri Cognitive PHQ form', () => {
  beforeEach(() => {
    submitForm.mockResolvedValue({ result: true })
    getSavedData.mockResolvedValue({ PHQ1: HALF, PHQ2: SEVERAL })
  })

  it('renders PHQ9 as an editable question with a Submit button', async () => {
    renderForm()

    expect(await screen.findByText(/Thoughts that you would be better off dead/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })

  it('lets PHQ9 be selected and saves only PHQ9, its follow-up and the score', async () => {
    const user = userEvent.setup()
    renderForm()

    await screen.findByText(/Thoughts that you would be better off dead/)

    // PHQ9 = "Not at all" -> no follow-up required, submit succeeds.
    const noneRadios = await screen.findAllByRole('radio', { name: NONE })
    await user.click(noneRadios[noneRadios.length - 1])
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(submitForm).toHaveBeenCalledTimes(1)
    const [payload, , formName] = submitForm.mock.calls[0]
    expect(formName).toBe('geriPhqForm')
    expect(Object.keys(payload).sort()).toEqual(['PHQ10', 'PHQ9', 'PHQExtra9'])
    expect(payload.PHQ9).toBe(NONE)
    expect(payload.PHQExtra9).toBe('')
    // PHQ1 (2) + PHQ2 (1) + PHQ9 (0)
    expect(payload.PHQ10).toBe(3)
  })

  it('does not write History Taking answers back to the database', async () => {
    const user = userEvent.setup()
    renderForm()

    await screen.findByText(/Thoughts that you would be better off dead/)
    const noneRadios = await screen.findAllByRole('radio', { name: NONE })
    await user.click(noneRadios[noneRadios.length - 1])
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    const [payload] = submitForm.mock.calls[0]
    for (const field of ['PHQ1', 'PHQ2', 'PHQ3', 'PHQ8', 'PHQ11', 'PHQShortAns11']) {
      expect(payload).not.toHaveProperty(field)
    }
  })

  it('reveals the follow-up when PHQ9 is not "Not at all"', async () => {
    const user = userEvent.setup()
    renderForm()

    await screen.findByText(/Thoughts that you would be better off dead/)
    expect(screen.queryByText(/Do you want to take your life now/)).toBeNull()

    const severalRadios = await screen.findAllByRole('radio', { name: SEVERAL })
    await user.click(severalRadios[severalRadios.length - 1])

    expect(await screen.findByText(/Do you want to take your life now/)).toBeInTheDocument()
  })
})
