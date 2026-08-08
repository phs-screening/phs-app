import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HelmetProvider } from 'react-helmet-async'
import EventDashboard from '../../src/pages/EventDashboard'
import {
  getEventDashboardSummary,
  getIncompletePatients,
} from '../../src/api/eventDashboardApi'

vi.mock('../../src/api/eventDashboardApi', () => ({
  getEventDashboardSummary: vi.fn(),
  getIncompletePatients: vi.fn(),
}))

const summary = {
  registeredPatients: 120,
  screeningPatients: 34,
  completedPatients: 86,
  refreshedAt: '2026-06-28T04:00:00.000Z',
  stationQueues: [
    { stationName: 'Triage', count: 8 },
    { stationName: 'Doctor Consult', count: 3 },
  ],
  printQueues: [{ queueName: 'Form A', count: 5 }],
  bottleneckStation: { stationName: 'Triage', count: 8 },
}

function patientResponse(data, pagination = { page: 1, totalPages: 1, total: data.length }) {
  return { data, pagination }
}

function renderDashboard() {
  return render(
    <HelmetProvider>
      <EventDashboard />
    </HelmetProvider>
  )
}

describe('EventDashboard data flow integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads and renders dashboard summary and incomplete patients', async () => {
    getEventDashboardSummary.mockResolvedValue({ data: summary })
    getIncompletePatients.mockResolvedValue(
      patientResponse([
        {
          queueNo: 17,
          initials: 'AL',
          age: 67,
          currentQueue: { stationName: 'Triage', position: 2 },
        },
      ])
    )

    renderDashboard()

    expect(await screen.findByText('Event Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Registered Patients')).toBeInTheDocument()
    expect(screen.getByText('120')).toBeInTheDocument()
    expect(screen.getByText('Still Screening')).toBeInTheDocument()
    expect(screen.getByText('34')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('86')).toBeInTheDocument()
    expect(screen.getByText('Bottleneck: Triage (8)')).toBeInTheDocument()

    const row = screen.getByRole('row', { name: /17 AL 67 Triage #2/i })
    expect(within(row).getByText('17')).toBeInTheDocument()
    expect(within(row).getByText('AL')).toBeInTheDocument()

    expect(getEventDashboardSummary).toHaveBeenCalledTimes(1)
    expect(getIncompletePatients).toHaveBeenCalledWith({ q: '', page: 1, limit: 25 })
  })

  it('searches incomplete patients with the submitted query', async () => {
    const user = userEvent.setup()
    getEventDashboardSummary.mockResolvedValue({ data: summary })
    getIncompletePatients
      .mockResolvedValueOnce(patientResponse([]))
      .mockResolvedValueOnce(
        patientResponse([
          {
            queueNo: 22,
            initials: 'BT',
            age: 58,
            currentQueue: null,
          },
        ])
      )

    renderDashboard()

    expect(await screen.findByText('No incomplete patients found.')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Search name or ID'), '  BT  ')
    await user.click(screen.getByRole('button', { name: 'Search' }))

    expect(await screen.findByRole('row', { name: /22 BT 58 Not in queue/i })).toBeInTheDocument()
    expect(getIncompletePatients).toHaveBeenLastCalledWith({
      q: 'BT',
      page: 1,
      limit: 25,
    })
  })

  it('shows an error message when dashboard data fails to load', async () => {
    getEventDashboardSummary.mockRejectedValue(new Error('Dashboard unavailable'))
    getIncompletePatients.mockResolvedValue(patientResponse([]))

    renderDashboard()

    await waitFor(() => {
      expect(screen.getByText('Dashboard unavailable')).toBeInTheDocument()
    })
    expect(screen.getByText('No incomplete patients found.')).toBeInTheDocument()
  })
})
