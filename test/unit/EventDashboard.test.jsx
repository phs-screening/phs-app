import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HelmetProvider } from 'react-helmet-async'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import EventDashboard from '../../src/pages/EventDashboard'
import { getEventDashboardSummary, getIncompletePatients } from '../../src/api/eventDashboardApi'
import { getPrintedFormAPdfQueue } from '../../src/services/printQueues'

vi.mock('../../src/api/eventDashboardApi', () => ({
  getEventDashboardSummary: vi.fn(),
  getIncompletePatients: vi.fn(),
}))

vi.mock('../../src/services/printQueues', () => ({
  getPrintedFormAPdfQueue: vi.fn(),
}))

const renderDashboard = () =>
  render(
    <HelmetProvider>
      <EventDashboard />
    </HelmetProvider>,
  )

describe('EventDashboard', () => {
  beforeEach(() => {
    getEventDashboardSummary.mockResolvedValue({
      data: {
        registeredPatients: 10,
        completedPatients: 0,
        screeningPatients: 10,
        stationQueues: [],
        printQueues: [],
        refreshedAt: '2026-08-22T00:00:00.000Z',
      },
    })
    getIncompletePatients.mockResolvedValue({
      data: [],
      pagination: { page: 1, totalPages: 0, total: 0 },
    })
    getPrintedFormAPdfQueue.mockResolvedValue({
      items: [],
      pagination: { page: 1, totalPages: 4, total: 4 },
    })
  })

  it('uses printed Form A history for completed and screening counts', async () => {
    renderDashboard()

    expect(await screen.findByText('Completed (Form A Printed)')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()
    expect(getPrintedFormAPdfQueue).toHaveBeenCalledWith({
      page: 1,
      limit: 1,
      includePagination: true,
    })
  })

  it('refreshes the printed count only on dashboard load and explicit refresh', async () => {
    const user = userEvent.setup()
    renderDashboard()

    await waitFor(() => expect(getPrintedFormAPdfQueue).toHaveBeenCalledTimes(1))

    await user.type(screen.getByLabelText('Search name or ID'), 'Ada')
    await user.click(screen.getByRole('button', { name: 'Search' }))
    await waitFor(() => expect(getIncompletePatients).toHaveBeenCalledTimes(2))
    expect(getPrintedFormAPdfQueue).toHaveBeenCalledTimes(1)
    expect(getEventDashboardSummary).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }))
    await waitFor(() => expect(getPrintedFormAPdfQueue).toHaveBeenCalledTimes(2))
    expect(getEventDashboardSummary).toHaveBeenCalledTimes(2)
  })
})
