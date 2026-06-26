import { beforeEach, describe, expect, it, vi } from 'vitest'
import { recalculatePatientStationCounts } from '../../src/api/stationsApi'
import { updateAllStationCounts } from '../../src/services/stationCounts'

vi.mock('../../src/api/stationsApi', () => ({
  recalculatePatientStationCounts: vi.fn(),
}))

describe('stationCounts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('returns recalculated station count data from the backend', async () => {
    const data = {
      visitedStationCount: 2,
      eligibleStationCount: 4,
      visitedStations: ['registration', 'triage'],
      eligibleStations: ['registration', 'triage', 'doctorConsult', 'summary'],
    }
    recalculatePatientStationCounts.mockResolvedValue({ data })

    await expect(updateAllStationCounts(7)).resolves.toEqual(data)

    expect(recalculatePatientStationCounts).toHaveBeenCalledWith(7)
    expect(console.log).toHaveBeenCalledWith('visited:', 2, 'eligible:', 4)
    expect(console.log).toHaveBeenCalledWith('eligible stations:', data.eligibleStations)
    expect(console.log).toHaveBeenCalledWith('visited stations:', data.visitedStations)
  })

  it('returns an empty object when the backend response has no data', async () => {
    recalculatePatientStationCounts.mockResolvedValue({})

    await expect(updateAllStationCounts(7)).resolves.toEqual({})

    expect(console.log).toHaveBeenCalledWith('visited:', undefined, 'eligible:', undefined)
    expect(console.log).toHaveBeenCalledWith('eligible stations:', [])
    expect(console.log).toHaveBeenCalledWith('visited stations:', [])
  })

  it('returns safe default counts when recalculation fails', async () => {
    const error = new Error('Backend unavailable')
    recalculatePatientStationCounts.mockRejectedValue(error)

    await expect(updateAllStationCounts(7)).resolves.toEqual({
      visitedStationCount: 0,
      eligibleStationCount: 0,
      visitedStations: [],
      eligibleStations: [],
    })

    expect(console.error).toHaveBeenCalledWith(
      'Failed to recalculate station counts via backend:',
      error
    )
  })
})
