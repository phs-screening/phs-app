import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormContext } from '../../src/api/utils'
import HxHcsrReviewForm from '../../src/forms/HistoryTakingTabs/HxHcsrReviewForm'
import { getSavedData } from '../../src/services/patientData'
import { submitForm } from '../../src/api/formHelpers.jsx'

vi.mock('../../src/api/formHelpers.jsx', () => ({ submitForm: vi.fn() }))
vi.mock('src/components/form-components/FormSubmitStatusHost', () => ({
  showFormSubmitError: vi.fn(),
  showFormSubmitSuccess: vi.fn(),
}))
vi.mock('../../src/services/patientData', () => ({ getSavedData: vi.fn() }))

const MAYBE = 'Maybe(Refer to M4/M5)'
const REASON = /Please specify/i

const renderForm = () =>
  render(
    <FormContext.Provider value={{ patientId: 7 }}>
      <HxHcsrReviewForm changeTab={vi.fn()} nextTab={1} />
    </FormContext.Provider>,
  )

const pick = async (user, value) => {
  const el = document.querySelector(`input[name="hxHcsrQ7"][value="${value}"]`)
  await user.click(el)
}

describe('HCSR Review — Maybe(Refer to M4/M5) option', () => {
  beforeEach(() => {
    submitForm.mockResolvedValue({ result: true })
    getSavedData.mockResolvedValue({})
  })

  it('offers Yes, No and Maybe', async () => {
    renderForm()
    await screen.findByRole('radio', { name: 'Yes' })

    expect(screen.getByRole('radio', { name: 'Yes' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'No' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: MAYBE })).toBeInTheDocument()
  })

  it('submits successfully when Maybe is selected', async () => {
    const user = userEvent.setup()
    renderForm()
    await screen.findByRole('radio', { name: MAYBE })

    await pick(user, MAYBE)
    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(submitForm).toHaveBeenCalledTimes(1)
    expect(submitForm.mock.calls[0][0].hxHcsrQ7).toBe(MAYBE)
  })

  it('shows the reason box for both Yes and Maybe, but not No', async () => {
    const user = userEvent.setup()
    renderForm()
    await screen.findByRole('radio', { name: 'Yes' })

    expect(screen.queryByText(REASON)).toBeNull()

    await pick(user, 'Yes')
    expect(await screen.findByText(REASON)).toBeInTheDocument()

    await pick(user, MAYBE)
    expect(await screen.findByText(REASON)).toBeInTheDocument()

    await pick(user, 'No')
    expect(screen.queryByText(REASON)).toBeNull()
  })

  it('keeps the reason on Maybe and clears it on No', async () => {
    const user = userEvent.setup()
    renderForm()
    await screen.findByRole('radio', { name: MAYBE })

    await pick(user, MAYBE)
    await user.type(
      document.querySelector('textarea[name="hxHcsrShortAnsQ7"]'),
      'Unclear, defer to M4/M5',
    )
    await user.click(screen.getByRole('button', { name: /submit/i }))
    expect(submitForm.mock.calls[0][0].hxHcsrShortAnsQ7).toBe('Unclear, defer to M4/M5')

    submitForm.mockClear()
    await pick(user, 'No')
    await user.click(screen.getByRole('button', { name: /submit/i }))
    expect(submitForm.mock.calls[0][0].hxHcsrShortAnsQ7).toBe('')
  })

  it('leaves the Yes flow unchanged', async () => {
    const user = userEvent.setup()
    renderForm()
    await screen.findByRole('radio', { name: 'Yes' })

    await pick(user, 'Yes')
    await user.type(document.querySelector('textarea[name="hxHcsrShortAnsQ7"]'), 'Chest pain')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    const [payload] = submitForm.mock.calls[0]
    expect(payload.hxHcsrQ7).toBe('Yes')
    expect(payload.hxHcsrShortAnsQ7).toBe('Chest pain')
  })
})
