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

const SEVERAL = '1 - Several days'
const HALF = '2 - More than half the days'
const PHQ9_TEXT = /PHQ9\. Thoughts that you would be better off dead/

const renderForm = () =>
  render(<FormContext.Provider value={{ patientId: 7 }}>
    <HxPhqForm changeTab={vi.fn()} nextTab={1} />
  </FormContext.Provider>)

// CustomRadioGroup renders one radio per option per question, in DOM order.
// index 0-3 = PHQ1, 4-7 = PHQ2.
const pick = async (user, questionIndex, optionLabel) => {
  const radios = await screen.findAllByRole('radio', { name: optionLabel })
  await user.click(radios[questionIndex])
}

describe('PHQ9 reveal at the cutoff', () => {
  beforeEach(() => {
    submitForm.mockResolvedValue({ result: true })
    getSavedData.mockResolvedValue({})
  })

  it('reveals PHQ9 when PHQ1 is set first, then PHQ2 (real volunteer order)', async () => {
    const user = userEvent.setup()
    renderForm()

    await pick(user, 0, HALF) // PHQ1 = 2
    expect(screen.queryByText(PHQ9_TEXT)).toBeNull()

    await pick(user, 1, SEVERAL) // PHQ2 = 1  -> total 3
    expect(await screen.findByText(PHQ9_TEXT)).toBeInTheDocument()
  })

  it('reveals PHQ9 when both are set to "Several days" then one raised', async () => {
    const user = userEvent.setup()
    renderForm()

    await pick(user, 0, SEVERAL) // PHQ1 = 1
    await pick(user, 1, SEVERAL) // PHQ2 = 1 -> total 2
    expect(screen.queryByText(PHQ9_TEXT)).toBeNull()

    await pick(user, 0, HALF) // PHQ1 = 2 -> total 3
    expect(await screen.findByText(PHQ9_TEXT)).toBeInTheDocument()
  })

  it('reveals PHQ9 when the form loads with saved answers already at the cutoff', async () => {
    getSavedData.mockResolvedValue({ PHQ1: HALF, PHQ2: SEVERAL })
    renderForm()

    expect(await screen.findByText(PHQ9_TEXT)).toBeInTheDocument()
  })
})
