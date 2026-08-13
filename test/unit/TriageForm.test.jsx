import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TriageForm from '../../src/forms/TriageForm'
import { FormContext } from '../../src/api/utils'
import { getPatientFormDataStrict } from '../../src/services/patientData'

vi.mock('../../src/api/formHelpers.jsx', () => ({
  formatBmi: vi.fn(() => null),
  submitForm: vi.fn(),
}))

vi.mock('../../src/services/patientData', () => ({
  getPatientFormDataStrict: vi.fn(),
}))

function renderTriageForm() {
  return render(
    <MemoryRouter>
      <FormContext.Provider value={{ patientId: 7 }}>
        <TriageForm />
      </FormContext.Provider>
    </MemoryRouter>,
  )
}

describe('TriageForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getPatientFormDataStrict.mockResolvedValue(null)
  })

  it('renders the new neck circumference and SpO2 fields', async () => {
    renderTriageForm()

    expect(await screen.findByLabelText('Triage Q15')).toBeInTheDocument()
    expect(screen.getByLabelText('Triage Q16')).toBeInTheDocument()
  })

  it('shows the Comm member warning only when Q9 is Yes', async () => {
    renderTriageForm()

    await screen.findByLabelText('Triage Q15')
    expect(screen.queryByText('Please inform a Comm member immediately.')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('radio', { name: 'Yes' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Please inform a Comm member immediately.')
  })

  it('flags temperature at 38 or above without flagging an empty value', async () => {
    renderTriageForm()

    const temperature = await screen.findByLabelText('Triage Q14')
    expect(screen.queryByText('Patient temperature needs closer scrutiny.')).not.toBeInTheDocument()

    fireEvent.change(temperature, { target: { value: '37.9' } })
    expect(screen.queryByText('Patient temperature needs closer scrutiny.')).not.toBeInTheDocument()

    fireEvent.change(temperature, { target: { value: '38' } })
    expect(screen.getByText('Patient temperature needs closer scrutiny.')).toBeInTheDocument()
  })

  it('flags SpO2 at 94 or below without flagging an empty value', async () => {
    renderTriageForm()

    const spo2 = await screen.findByLabelText('Triage Q16')
    expect(screen.queryByText('Patient SpO2 needs closer scrutiny.')).not.toBeInTheDocument()

    fireEvent.change(spo2, { target: { value: '95' } })
    expect(screen.queryByText('Patient SpO2 needs closer scrutiny.')).not.toBeInTheDocument()

    fireEvent.change(spo2, { target: { value: '94' } })
    expect(screen.getByText('Patient SpO2 needs closer scrutiny.')).toBeInTheDocument()
  })
})
