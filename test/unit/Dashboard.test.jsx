import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import Dashboard from '../../src/pages/Dashboard'
import { FormContext } from '../../src/api/utils'
import { isLoggedin } from '../../src/services/authSession'

vi.mock('../../src/services/authSession', () => ({
  isLoggedin: vi.fn(),
}))

vi.mock('../../src/components/dashboard/PatientTimeline', () => ({
  default: ({ patientId, initialSummary }) => (
    <div>
      Timeline for {patientId}
      {initialSummary ? ` preloaded ${initialSummary.patient.queueNo}` : ''}
    </div>
  ),
}))

function CurrentPath() {
  const location = useLocation()
  return <div data-testid='current-path'>{location.pathname}</div>
}

function renderDashboard(patientId, state) {
  return render(
    <HelmetProvider>
      <FormContext.Provider value={{ patientId }}>
        <MemoryRouter initialEntries={[{ pathname: '/app/dashboard', state }]}>
          <Routes>
            <Route path='/app/dashboard' element={<Dashboard />} />
            <Route path='/login' element={<CurrentPath />} />
            <Route path='/app/registration' element={<CurrentPath />} />
          </Routes>
        </MemoryRouter>
      </FormContext.Provider>
    </HelmetProvider>
  )
}

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  it('redirects logged-out users without showing the select-patient alert', async () => {
    isLoggedin.mockReturnValue(false)

    renderDashboard(-1)

    await waitFor(() => {
      expect(screen.getByTestId('current-path')).toHaveTextContent('/login')
    })
    expect(window.alert).not.toHaveBeenCalled()
  })

  it('alerts logged-in users who open the dashboard without a selected patient', async () => {
    isLoggedin.mockReturnValue(true)

    renderDashboard(-1)

    await waitFor(() => {
      expect(screen.getByTestId('current-path')).toHaveTextContent('/app/registration')
    })
    expect(window.alert).toHaveBeenCalledWith(
      'You need to enter the queue number for the patient you are attending to!'
    )
  })

  it('renders the patient timeline when a patient is selected', () => {
    renderDashboard(123)

    expect(screen.getByText('Timeline for 123')).toBeInTheDocument()
    expect(window.alert).not.toHaveBeenCalled()
  })

  it('passes a preloaded station summary to the timeline', () => {
    renderDashboard(123, { stationSummary: { patient: { queueNo: 123 } } })

    expect(screen.getByText('Timeline for 123 preloaded 123')).toBeInTheDocument()
  })
})
