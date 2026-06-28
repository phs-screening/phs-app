import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import RegisterPatient from '../../src/components/RegisterPatient'
import { FormContext } from '../../src/api/utils'
import {
  getAllPatientNamesStrict,
  getPatientNameMatchesStrict,
  getPreRegDataByIdStrict,
} from '../../src/services/patientData'
import { updateAllStationCounts } from '../../src/services/stationCounts'

vi.mock('../../src/services/patientData', () => ({
  getAllPatientNamesStrict: vi.fn(),
  getPatientNameMatchesStrict: vi.fn(),
  getPreRegDataByIdStrict: vi.fn(),
}))

vi.mock('../../src/services/stationCounts', () => ({
  updateAllStationCounts: vi.fn(),
}))

function DashboardTarget() {
  return <div data-testid='dashboard-route'>Dashboard route</div>
}

function renderLookup(contextOverrides = {}) {
  const context = {
    updatePatientInfo: vi.fn(),
    clearPatient: vi.fn(),
    ...contextOverrides,
  }

  render(
    <FormContext.Provider value={context}>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path='/' element={<RegisterPatient />} />
          <Route path='/app/dashboard' element={<DashboardTarget />} />
        </Routes>
      </MemoryRouter>
    </FormContext.Provider>
  )

  return context
}

describe('Patient lookup data flow integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    window.alert = vi.fn()
    getAllPatientNamesStrict.mockResolvedValue([])
    updateAllStationCounts.mockResolvedValue({})
  })

  it('loads patient lookup options without opening the registration form', async () => {
    renderLookup()

    expect(await screen.findByText('Patient Lookup')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Register New Patient' })).toBeInTheDocument()
    expect(getAllPatientNamesStrict).toHaveBeenCalledWith('patients', {
      q: '',
      page: 1,
      limit: 20,
    })
  })

  it('looks up a patient by queue number and navigates to the dashboard', async () => {
    const user = userEvent.setup()
    const patient = { queueNo: 42, initials: 'AL', age: 67 }
    const context = renderLookup()
    getPreRegDataByIdStrict.mockResolvedValue(patient)

    await user.type(screen.getByPlaceholderText('Queue number'), '42')
    await user.click(screen.getByRole('button', { name: 'Search by Queue Number' }))

    await waitFor(() => {
      expect(context.updatePatientInfo).toHaveBeenCalledWith(patient)
    })
    expect(updateAllStationCounts).toHaveBeenCalledWith(42)
    expect(await screen.findByTestId('dashboard-route')).toBeInTheDocument()
  })

  it('searches patients by exact name and selects a returned match', async () => {
    const user = userEvent.setup()
    const patient = {
      queueNo: 55,
      initials: 'BT',
      birthday: '1958-02-03T00:00:00.000Z',
    }
    const context = renderLookup()
    getPatientNameMatchesStrict.mockResolvedValue({ data: [patient], pagination: null })

    await user.type(screen.getByLabelText('Patient name'), 'BT')
    await user.click(screen.getByRole('button', { name: 'Search by Name' }))

    expect(await screen.findByText('Select the matching patient by birthday.')).toBeInTheDocument()
    expect(screen.getByText('55')).toBeInTheDocument()
    expect(screen.getByText('BT')).toBeInTheDocument()
    expect(getPatientNameMatchesStrict).toHaveBeenCalledWith({
      initials: 'BT',
      page: 1,
      limit: 10,
    })

    await user.click(screen.getByRole('button', { name: 'Select' }))

    await waitFor(() => {
      expect(context.updatePatientInfo).toHaveBeenCalledWith(patient)
    })
    expect(updateAllStationCounts).toHaveBeenCalledWith(55)
    expect(await screen.findByTestId('dashboard-route')).toBeInTheDocument()
  })
})
