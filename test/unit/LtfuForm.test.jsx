import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { FormContext } from '../../src/api/utils'
import { submitForm } from '../../src/api/formHelpers.jsx'
import LtfuForm from '../../src/forms/LtfuForm'
import { getSavedData } from '../../src/services/patientData'

vi.mock('../../src/api/formHelpers.jsx', () => ({
  submitForm: vi.fn(),
}))

vi.mock('../../src/services/patientData', () => ({
  getSavedData: vi.fn(),
}))

vi.mock('../../src/components/form-components/FormSubmitStatusHost.jsx', () => ({
  showFormSubmitError: vi.fn(),
  showFormSubmitSuccess: vi.fn().mockResolvedValue(undefined),
}))

function renderLtfuForm() {
  return render(
    <MemoryRouter initialEntries={['/ltfu']}>
      <FormContext.Provider value={{ patientId: 7 }}>
        <Routes>
          <Route path='/ltfu' element={<LtfuForm />} />
          <Route path='/app/dashboard' element={<div>Patient dashboard</div>} />
        </Routes>
      </FormContext.Provider>
    </MemoryRouter>,
  )
}

describe('LtfuForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getSavedData.mockResolvedValue({})
    submitForm.mockResolvedValue({ result: true })
  })

  it('renders the factored question and requires an answer', async () => {
    renderLtfuForm()

    expect(screen.getByText('Has patient completed LTFU')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(await screen.findAllByText('LTFU completion status is required')).toHaveLength(2)
    expect(submitForm).not.toHaveBeenCalled()
  })

  it.each(['Yes', 'No'])('submits %s and returns to the dashboard', async (answer) => {
    renderLtfuForm()

    fireEvent.click(screen.getByRole('radio', { name: answer }))
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(submitForm).toHaveBeenCalledWith({ LTFU1: answer }, 7, 'ltfuForm')
    })
    expect(await screen.findByText('Patient dashboard')).toBeInTheDocument()
  })

  it('loads a previously saved answer', async () => {
    getSavedData.mockResolvedValue({ LTFU1: 'No' })

    renderLtfuForm()

    expect(await screen.findByRole('radio', { name: 'No' })).toBeChecked()
    expect(getSavedData).toHaveBeenCalledWith(7, 'ltfuForm')
  })
})
