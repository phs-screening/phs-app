import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiGet, apiPost } from '../../src/apiClient'
import {
  getPatientStationEligibility,
  getPatientStationStatus,
  getPatientStationSummary,
  getStations,
  recalculatePatientStationCounts,
} from '../../src/api/stationsApi'

vi.mock('../../src/apiClient', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
}))

describe('stationsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('gets the station list', () => {
    getStations()

    expect(apiGet).toHaveBeenCalledWith('/stations')
  })

  it('gets patient station resources with encoded patient ids', () => {
    getPatientStationStatus('patient/7')
    getPatientStationSummary('patient/7')
    getPatientStationEligibility('patient/7')

    expect(apiGet).toHaveBeenNthCalledWith(1, '/patients/patient%2F7/station-status')
    expect(apiGet).toHaveBeenNthCalledWith(2, '/patients/patient%2F7/station-summary')
    expect(apiGet).toHaveBeenNthCalledWith(3, '/patients/patient%2F7/station-eligibility')
  })

  it('posts station count recalculation for an encoded patient id', () => {
    recalculatePatientStationCounts('patient/7')

    expect(apiPost).toHaveBeenCalledWith(
      '/patients/patient%2F7/station-counts/recalculate',
      {}
    )
  })
})
