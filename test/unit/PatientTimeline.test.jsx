import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PatientTimeline from '../../src/components/dashboard/PatientTimeline'
import { ScrollTopContext } from '../../src/api/utils'
import { getPatientStationSummary } from '../../src/api/stationsApi'

vi.mock('../../src/api/stationsApi', () => ({
  getPatientStationSummary: vi.fn(),
}))

vi.mock('../../src/components/dashboard/StationTimelineItem', () => ({
  default: ({ item }) => <div>{item.label}</div>,
}))

const summary = {
  patient: { queueNo: 22 },
  status: { triage: false },
  eligibleStations: ['Triage'],
  stations: [
    {
      key: 'triage',
      displayName: 'Triage',
      route: 'triage',
      eligibilityName: 'Triage',
      eligible: true,
    },
  ],
}

function renderTimeline(initialSummary) {
  return render(
    <MemoryRouter>
      <ScrollTopContext.Provider value={{ scrollTop: vi.fn() }}>
        <PatientTimeline patientId={22} initialSummary={initialSummary} />
      </ScrollTopContext.Provider>
    </MemoryRouter>,
  )
}

describe('PatientTimeline', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders matching preloaded data without refetching', () => {
    renderTimeline(summary)

    expect(screen.getByText('Triage')).toBeInTheDocument()
    expect(getPatientStationSummary).not.toHaveBeenCalled()
  })

  it('fetches station data on direct navigation', async () => {
    getPatientStationSummary.mockResolvedValue({ data: summary })
    renderTimeline()

    await waitFor(() => expect(screen.getByText('Triage')).toBeInTheDocument())
    expect(getPatientStationSummary).toHaveBeenCalledWith(22)
  })
})
