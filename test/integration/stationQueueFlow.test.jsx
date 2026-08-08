import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StationQueue from '../../src/components/StationQueue'
import {
  addPatientsToStationQueue,
  getQueueEntries,
  removePatientsFromStationQueue,
} from '../../src/api/queuesApi'
import { getProfile } from '../../src/services/authSession'
import { getPreRegDataByIdStrict, getSavedData } from '../../src/services/patientData'

vi.mock('../../src/api/queuesApi', () => ({
  addPatientsToStationQueue: vi.fn(),
  createStationQueue: vi.fn(),
  deleteStationQueue: vi.fn(),
  getQueueEntries: vi.fn(),
  removeFirstPatientFromStationQueue: vi.fn(),
  removePatientsFromStationQueue: vi.fn(),
  restoreLastRemovedToFront: vi.fn(),
}))

vi.mock('../../src/services/authSession', () => ({
  getProfile: vi.fn(),
}))

vi.mock('../../src/services/patientData', () => ({
  getPreRegDataByIdStrict: vi.fn(),
  getSavedData: vi.fn(),
}))

const queueResponse = {
  data: [
    {
      stationName: 'Triage',
      queueItems: ['5: Mr BO'],
      lastRemoved: { queueItems: ['3: Ms CY'] },
    },
  ],
}

describe('StationQueue data flow integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.alert = vi.fn()
    getProfile.mockResolvedValue({ username: 'admin@example.com', is_admin: true })
    getQueueEntries.mockResolvedValue(queueResponse)
  })

  it('loads and renders station queue data', async () => {
    render(<StationQueue />)

    expect(await screen.findByText('Station Queue Management')).toBeInTheDocument()
    expect(screen.getByText('Triage')).toBeInTheDocument()
    expect(screen.getByText('Mr BO')).toBeInTheDocument()
    expect(screen.getByText('id: 5')).toBeInTheDocument()
    expect(screen.getByText('3: Ms CY')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add Station' })).toBeInTheDocument()
    expect(getQueueEntries).toHaveBeenCalledTimes(1)
  })

  it('adds an existing patient to a station queue using the displayed patient string', async () => {
    const user = userEvent.setup()
    getPreRegDataByIdStrict.mockResolvedValue({ queueNo: 11, initials: 'AL' })
    getSavedData.mockResolvedValue({ registrationQ1: 'Ms' })

    render(<StationQueue />)

    await screen.findByText('Triage')
    await user.type(screen.getByLabelText('Add patient IDs'), '11')
    await user.click(screen.getByRole('button', { name: 'Add to Back' }))

    await waitFor(() => {
      expect(addPatientsToStationQueue).toHaveBeenCalledWith('Triage', ['11: Ms AL'])
    })
    expect(getPreRegDataByIdStrict).toHaveBeenCalledWith(11, 'patients')
    expect(getSavedData).toHaveBeenCalledWith(11, 'registrationForm')
  })

  it('removes selected patients from a station queue by matching displayed queue items', async () => {
    const user = userEvent.setup()

    render(<StationQueue />)

    await screen.findByText('Triage')
    await user.type(screen.getByLabelText('Remove patient IDs'), '5')
    await user.click(screen.getByRole('button', { name: 'Remove' }))

    await waitFor(() => {
      expect(removePatientsFromStationQueue).toHaveBeenCalledWith('Triage', ['5: Mr BO'])
    })
  })

  it('shows a load error when station queues fail to load', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    getQueueEntries.mockRejectedValue(new Error('Queue backend unavailable'))

    render(<StationQueue />)

    expect(
      await screen.findByText(
        'Unable to load station queues. Details: Queue backend unavailable'
      )
    ).toBeInTheDocument()
  })
})
