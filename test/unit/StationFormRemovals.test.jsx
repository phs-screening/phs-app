import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import DoctorsConsultForm from '../../src/forms/DoctorsConsultForm'
import WceMain from '../../src/forms/WceTabs/WceMain'
import { FormContext, ScrollTopContext } from '../../src/api/utils'
import { getSavedData } from '../../src/services/patientData'

vi.mock('../../src/services/patientData', () => ({
  getSavedData: vi.fn(),
}))

vi.mock('../../src/forms/WceTabs/WceForm.jsx', () => ({
  default: () => <div>WCE form</div>,
}))

describe('station form removals', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getSavedData.mockResolvedValue({})
  })

  it('does not show a Gynae section in the WCE station', () => {
    render(
      <ThemeProvider theme={createTheme()}>
        <ScrollTopContext.Provider value={{ scrollTop: vi.fn() }}>
          <WceMain />
        </ScrollTopContext.Provider>
      </ThemeProvider>,
    )

    expect(screen.getByRole('tab', { name: 'WCE' })).toBeInTheDocument()
    expect(screen.queryByRole('tab', { name: 'Gynae' })).not.toBeInTheDocument()
  })

  it('removes Doctor Consult Q4, its dependent Q5, and Q9 while retaining Q8', async () => {
    render(
      <MemoryRouter>
        <FormContext.Provider value={{ patientId: 7 }}>
          <DoctorsConsultForm />
        </FormContext.Provider>
      </MemoryRouter>,
    )

    expect(await screen.findByText('Refer to Dental?')).toBeInTheDocument()
    expect(screen.queryByText('Refer to dietitian?')).not.toBeInTheDocument()
    expect(screen.queryByText('Reason for Dietitian referral')).not.toBeInTheDocument()
    expect(screen.queryByText('Reason for Dental referral')).not.toBeInTheDocument()
  })
})
