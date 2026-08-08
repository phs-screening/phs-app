import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import RegisterPatient from '../../src/components/RegisterPatient'
import { FormContext } from '../../src/api/utils'
import { getAllPatientNamesStrict, getPatientNameMatchesStrict } from '../../src/services/patientData'
import {
  checkInPreRegistrationStrict,
  findPreRegistrationByQueueStrict,
  searchPreRegistrationsStrict,
} from '../../src/services/preRegistrations'
import { getPatientStationSummary } from '../../src/api/stationsApi'

vi.mock('../../src/services/patientData', () => ({
  getAllPatientNamesStrict: vi.fn(),
  getPatientNameMatchesStrict: vi.fn(),
}))

vi.mock('../../src/services/preRegistrations', () => ({
  checkInPreRegistrationStrict: vi.fn(),
  findPreRegistrationByQueueStrict: vi.fn(),
  searchPreRegistrationsStrict: vi.fn(),
}))

vi.mock('../../src/api/stationsApi', () => ({
  getPatientStationSummary: vi.fn(),
}))

function DashboardTarget() {
  return <div data-testid='dashboard-route'>Dashboard route</div>
}

function RegistrationTarget() {
  return <div data-testid='registration-route'>Registration route</div>
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
          <Route path='/app/reg' element={<RegistrationTarget />} />
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
    findPreRegistrationByQueueStrict.mockResolvedValue(null)
    searchPreRegistrationsStrict.mockResolvedValue({ data: [], pagination: null })
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

  it('looks up a checked-in patient by queue number and navigates to the dashboard', async () => {
    const user = userEvent.setup()
    const patient = { queueNo: 42, initials: 'AL', age: 67, registrationForm: {} }
    const stationSummary = { patient, stations: [] }
    const context = renderLookup()
    getPatientStationSummary.mockResolvedValue({ data: stationSummary })

    await user.type(screen.getByPlaceholderText('Queue number'), '42')
    await user.click(screen.getByRole('button', { name: 'Search by Queue Number' }))

    await waitFor(() => {
      expect(context.updatePatientInfo).toHaveBeenCalledWith(patient)
    })
    expect(getPatientStationSummary).toHaveBeenCalledWith(42)
    expect(findPreRegistrationByQueueStrict).toHaveBeenCalledWith(42)
    expect(await screen.findByTestId('dashboard-route')).toBeInTheDocument()
  })

  it('offers check-in when a queue number only matches an available pre-registration', async () => {
    const user = userEvent.setup()
    const preRegistration = { queueNo: 77, initials: 'CD', status: 'available' }
    const checkedIn = { queueNo: 77, initials: 'CD' }
    const context = renderLookup()
    getPatientStationSummary.mockRejectedValue({ status: 404 })
    findPreRegistrationByQueueStrict.mockResolvedValue(preRegistration)
    checkInPreRegistrationStrict.mockResolvedValue(checkedIn)

    await user.type(screen.getByPlaceholderText('Queue number'), '77')
    await user.click(screen.getByRole('button', { name: 'Search by Queue Number' }))

    expect(await screen.findByText('Pre-registered patient')).toBeInTheDocument()
    expect(screen.getByText('Queue 77: CD')).toBeInTheDocument()
    expect(context.updatePatientInfo).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Confirm and Check In' }))

    await waitFor(() => {
      expect(checkInPreRegistrationStrict).toHaveBeenCalledWith(77)
    })
    expect(context.updatePatientInfo).toHaveBeenCalledWith(checkedIn)
    expect(await screen.findByTestId('registration-route')).toBeInTheDocument()
  })

  it('searches patients by name and opens the dashboard for a selected match', async () => {
    const user = userEvent.setup()
    const patient = {
      queueNo: 55,
      initials: 'BT',
      birthday: '1958-02-03T00:00:00.000Z',
      registrationForm: {},
    }
    const stationSummary = { patient, stations: [] }
    const context = renderLookup()
    getPatientNameMatchesStrict.mockResolvedValue({ data: [patient], pagination: null })
    getPatientStationSummary.mockResolvedValue({ data: stationSummary })

    await user.type(screen.getByLabelText('Patient name or surname'), 'BT')
    await user.click(screen.getByRole('button', { name: 'Search by Name' }))

    expect(await screen.findByText('Select the matching patient by birthday.')).toBeInTheDocument()
    expect(screen.getByText('55')).toBeInTheDocument()
    expect(screen.getByText('Checked in')).toBeInTheDocument()
    expect(getPatientNameMatchesStrict).toHaveBeenCalledWith({
      initials: 'BT',
      page: 1,
      limit: 10,
    })
    expect(searchPreRegistrationsStrict).toHaveBeenCalledWith({
      initials: 'BT',
      page: 1,
      limit: 10,
    })

    await user.click(screen.getByRole('button', { name: 'Open Dashboard' }))

    await waitFor(() => {
      expect(context.updatePatientInfo).toHaveBeenCalledWith(patient)
    })
    expect(getPatientStationSummary).toHaveBeenCalledWith(55)
    expect(await screen.findByTestId('dashboard-route')).toBeInTheDocument()
  })

  it('merges pre-registration-only results into the name search matches', async () => {
    const user = userEvent.setup()
    const preRegistration = {
      queueNo: 91,
      initials: 'EF',
      birthday: '1962-07-14T00:00:00.000Z',
      status: 'available',
    }
    const checkedIn = { queueNo: 91, initials: 'EF' }
    const context = renderLookup()
    getPatientNameMatchesStrict.mockResolvedValue({ data: [], pagination: null })
    searchPreRegistrationsStrict.mockResolvedValue({ data: [preRegistration], pagination: null })
    checkInPreRegistrationStrict.mockResolvedValue(checkedIn)

    await user.type(screen.getByLabelText('Patient name or surname'), 'EF')
    await user.click(screen.getByRole('button', { name: 'Search by Name' }))

    expect(await screen.findByText('Select the matching patient by birthday.')).toBeInTheDocument()
    expect(screen.getByText('91')).toBeInTheDocument()
    expect(screen.getByText('Pre-registration')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Check In' }))

    await waitFor(() => {
      expect(checkInPreRegistrationStrict).toHaveBeenCalledWith(91)
    })
    expect(context.updatePatientInfo).toHaveBeenCalledWith(checkedIn)
    expect(await screen.findByTestId('registration-route')).toBeInTheDocument()
  })
})
