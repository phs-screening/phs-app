import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import RegisterPatient from '../../src/components/RegisterPatient'
import { FormContext } from '../../src/api/utils'
import { getPatientStationSummary } from '../../src/api/stationsApi'
import { getPatientNameMatchesStrict } from '../../src/services/patientData'
import {
  checkInPreRegistrationStrict,
  findPreRegistrationByQueueStrict,
  searchPreRegistrationsStrict,
} from '../../src/services/preRegistrations'

vi.mock('../../src/services/patientData', () => ({
  getAllPatientNamesStrict: vi.fn().mockResolvedValue([]),
  getPatientNameMatchesStrict: vi.fn().mockResolvedValue({ data: [] }),
}))

vi.mock('../../src/api/stationsApi', () => ({
  getPatientStationSummary: vi.fn(),
}))

vi.mock('../../src/services/preRegistrations', () => ({
  checkInPreRegistrationStrict: vi.fn(),
  findPreRegistrationByQueueStrict: vi.fn(),
  searchPreRegistrationsStrict: vi.fn().mockResolvedValue({ data: [] }),
}))

function DashboardResult() {
  const location = useLocation()
  return <div>Dashboard {location.state?.stationSummary?.patient?.queueNo}</div>
}

function RegistrationResult() {
  return <div>Registration form</div>
}

function renderLookup(updatePatientInfo = vi.fn()) {
  render(
    <FormContext.Provider value={{ updatePatientInfo, clearPatient: vi.fn() }}>
      <MemoryRouter initialEntries={['/app/registration']}>
        <Routes>
          <Route path='/app/registration' element={<RegisterPatient />} />
          <Route path='/app/dashboard' element={<DashboardResult />} />
          <Route path='/app/reg' element={<RegistrationResult />} />
        </Routes>
      </MemoryRouter>
    </FormContext.Provider>,
  )
}

describe('RegisterPatient optimized selection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    findPreRegistrationByQueueStrict.mockResolvedValue(null)
    searchPreRegistrationsStrict.mockResolvedValue({ data: [] })
    getPatientNameMatchesStrict.mockResolvedValue({ data: [] })
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

    renderLookup(updatePatientInfo)

    await user.type(screen.getByPlaceholderText('Queue number'), '22')
    await user.click(screen.getByRole('button', { name: 'Search by Queue Number' }))

    await waitFor(() => expect(screen.getByText('Dashboard 22')).toBeInTheDocument())
    expect(getPatientStationSummary).toHaveBeenCalledTimes(1)
    expect(getPatientStationSummary).toHaveBeenCalledWith(22)
    expect(updatePatientInfo).toHaveBeenCalledWith(stationSummary.patient)
  })

  it('requires confirmation before checking in an available pre-registration', async () => {
    const user = userEvent.setup()
    const updatePatientInfo = vi.fn()
    const preRegistration = {
      queueNo: 22,
      initials: 'Yeo Z W D',
      birthday: '1965-07-07T00:00:00.000Z',
      status: 'available',
    }
    getPatientStationSummary.mockRejectedValue(
      Object.assign(new Error('Not found'), { status: 404 }),
    )
    findPreRegistrationByQueueStrict.mockResolvedValue(preRegistration)
    checkInPreRegistrationStrict.mockResolvedValue({ queueNo: 22, initials: 'Yeo Z W D' })
    renderLookup(updatePatientInfo)

    await user.type(screen.getByPlaceholderText('Queue number'), '22')
    await user.click(screen.getByRole('button', { name: 'Search by Queue Number' }))

    expect(await screen.findByRole('button', { name: 'Confirm and Check In' })).toBeInTheDocument()
    expect(checkInPreRegistrationStrict).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Confirm and Check In' }))
    expect(await screen.findByText('Registration form')).toBeInTheDocument()
    expect(checkInPreRegistrationStrict).toHaveBeenCalledWith(22)
    expect(updatePatientInfo).toHaveBeenCalledWith({ queueNo: 22, initials: 'Yeo Z W D' })
  })

  it('resumes Registration when a checked-in pre-registration already has a patient', async () => {
    const user = userEvent.setup()
    const updatePatientInfo = vi.fn()
    getPatientStationSummary.mockResolvedValue({
      data: { patient: { queueNo: 22, initials: 'Yeo Z W D' }, status: {}, stations: [] },
    })
    findPreRegistrationByQueueStrict.mockResolvedValue({ queueNo: 22, status: 'checked_in' })
    checkInPreRegistrationStrict.mockResolvedValue({ queueNo: 22, initials: 'Yeo Z W D' })
    renderLookup(updatePatientInfo)

    await user.type(screen.getByPlaceholderText('Queue number'), '22')
    await user.click(screen.getByRole('button', { name: 'Search by Queue Number' }))

    expect(await screen.findByText('Registration form')).toBeInTheDocument()
    expect(checkInPreRegistrationStrict).toHaveBeenCalledWith(22)
  })

  it('opens the dashboard for a completed pre-registration', async () => {
    const user = userEvent.setup()
    const stationSummary = {
      patient: { queueNo: 22, initials: 'Yeo Z W D', registrationForm: 22 },
      status: {},
      stations: [],
    }
    getPatientStationSummary.mockResolvedValue({ data: stationSummary })
    findPreRegistrationByQueueStrict.mockResolvedValue({ queueNo: 22, status: 'completed' })
    renderLookup()

    await user.type(screen.getByPlaceholderText('Queue number'), '22')
    await user.click(screen.getByRole('button', { name: 'Search by Queue Number' }))

    expect(await screen.findByText('Dashboard 22')).toBeInTheDocument()
    expect(checkInPreRegistrationStrict).not.toHaveBeenCalled()
  })

  it('uses preregistration status when selecting an existing patient by name', async () => {
    const user = userEvent.setup()
    getPatientNameMatchesStrict.mockResolvedValue({
      data: [{ queueNo: 22, initials: 'Yeo Z W D' }],
    })
    searchPreRegistrationsStrict.mockResolvedValue({
      data: [{ queueNo: 22, initials: 'Yeo Z W D', status: 'checked_in' }],
    })
    checkInPreRegistrationStrict.mockResolvedValue({ queueNo: 22, initials: 'Yeo Z W D' })
    renderLookup()

    await user.type(screen.getByRole('combobox', { name: 'Patient name' }), 'Yeo Z W D')
    await user.click(screen.getByRole('button', { name: 'Search by Name' }))

    const resumeButton = await screen.findByRole('button', { name: 'Resume Registration' })
    await user.click(resumeButton)

    expect(await screen.findByText('Registration form')).toBeInTheDocument()
    expect(checkInPreRegistrationStrict).toHaveBeenCalledWith(22)
  })
})
