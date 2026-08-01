import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import RegisterPatient from '../../src/components/RegisterPatient'
import { FormContext } from '../../src/api/utils'
import { getPatientStationSummary } from '../../src/api/stationsApi'

vi.mock('../../src/services/patientData', () => ({
  getAllPatientNamesStrict: vi.fn().mockResolvedValue([]),
  getPatientNameMatchesStrict: vi.fn().mockResolvedValue({ data: [] }),
}))

vi.mock('../../src/api/stationsApi', () => ({
  getPatientStationSummary: vi.fn(),
}))

function DashboardResult() {
  const location = useLocation()
  return <div>Dashboard {location.state?.stationSummary?.patient?.queueNo}</div>
}

describe('RegisterPatient optimized selection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads patient and station data with one summary request', async () => {
    const user = userEvent.setup()
    const updatePatientInfo = vi.fn()
    const stationSummary = {
      patient: { queueNo: 22, initials: 'ABC' },
      status: {},
      stations: [],
    }
    getPatientStationSummary.mockResolvedValue({ data: stationSummary })

    render(
      <FormContext.Provider
        value={{ updatePatientInfo, clearPatient: vi.fn() }}
      >
        <MemoryRouter initialEntries={['/app/registration']}>
          <Routes>
            <Route path='/app/registration' element={<RegisterPatient />} />
            <Route path='/app/dashboard' element={<DashboardResult />} />
          </Routes>
        </MemoryRouter>
      </FormContext.Provider>,
    )

    await user.type(screen.getByPlaceholderText('Queue number'), '22')
    await user.click(screen.getByRole('button', { name: 'Search by Queue Number' }))

    await waitFor(() => expect(screen.getByText('Dashboard 22')).toBeInTheDocument())
    expect(getPatientStationSummary).toHaveBeenCalledTimes(1)
    expect(getPatientStationSummary).toHaveBeenCalledWith(22)
    expect(updatePatientInfo).toHaveBeenCalledWith(stationSummary.patient)
  })
})
