import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { FormContext } from '../../src/api/utils'
import OphthalForm from '../../src/forms/OphthalForm'
import { getSavedData } from '../../src/services/patientData'
import { submitForm } from '../../src/api/formHelpers.jsx'

vi.mock('../../src/api/formHelpers.jsx', () => ({ submitForm: vi.fn() }))
vi.mock('src/components/form-components/FormSubmitStatusHost', () => ({
  showFormSubmitError: vi.fn(),
  showFormSubmitSuccess: vi.fn(),
}))
vi.mock('../../src/services/patientData', () => ({ getSavedData: vi.fn() }))

const renderForm = () =>
  render(
    <MemoryRouter>
      <FormContext.Provider value={{ patientId: 7 }}>
        <OphthalForm />
      </FormContext.Provider>
    </MemoryRouter>,
  )

const pickRadio = async (user, name, value) => {
  const el = document.querySelector(`input[name="${name}"][value="${value}"]`)
  await user.click(el)
}

describe('Ophthal form — acuity readings are optional', () => {
  beforeEach(() => {
    submitForm.mockResolvedValue({ result: true })
    getSavedData.mockResolvedValue({})
  })

  it('submits with all four acuity readings left blank', async () => {
    const user = userEvent.setup()
    renderForm()

    // Everything that is still required.
    await screen.findByText('VISION SCREENING')
    await pickRadio(user, 'OphthalQ1', 'No')
    await user.type(document.querySelector('textarea[name="OphthalQ2"]'), 'No concerns')
    await pickRadio(user, 'OphthalQ8', 'No')
    await pickRadio(user, 'OphthalQ10', 'None')
    await pickRadio(user, 'OphthalQ12', 'No')
    await pickRadio(user, 'OphthalQ13', 'No')

    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(submitForm).toHaveBeenCalledTimes(1)
    const [payload] = submitForm.mock.calls[0]
    for (const field of ['OphthalQ4', 'OphthalQ5', 'OphthalQ6', 'OphthalQ7']) {
      expect(payload[field]).toBe('')
    }
  })

  it('shows the ___ placeholder on every acuity input', async () => {
    renderForm()
    await screen.findByText('VISION SCREENING')

    for (const field of ['OphthalQ4', 'OphthalQ5', 'OphthalQ6', 'OphthalQ7']) {
      expect(document.querySelector(`input[name="${field}"]`)).toHaveAttribute(
        'placeholder',
        '___',
      )
    }
  })

  it('renders both optional remark fields', async () => {
    renderForm()
    await screen.findByText('VISION SCREENING')

    expect(document.querySelector('textarea[name="OphthalQ4Remark"]')).toBeInTheDocument()
    expect(document.querySelector('textarea[name="OphthalQ5Remark"]')).toBeInTheDocument()
  })
})
