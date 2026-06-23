import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiGet } from '../../src/apiClient'
import {
  getEventDashboardSummary,
  getIncompletePatients,
} from '../../src/api/eventDashboardApi'

vi.mock('../../src/apiClient', () => ({
  apiGet: vi.fn(),
}))

describe('eventDashboardApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('gets the event dashboard summary', () => {
    getEventDashboardSummary()

    expect(apiGet).toHaveBeenCalledWith('/event-dashboard/summary')
  })

  it('gets incomplete patients with default pagination', () => {
    getIncompletePatients()

    expect(apiGet).toHaveBeenCalledWith('/event-dashboard/incomplete-patients?page=1&limit=25')
  })

  it('trims and includes a non-empty search query', () => {
    getIncompletePatients({ q: '  Ada  ', page: 2, limit: 10 })

    expect(apiGet).toHaveBeenCalledWith(
      '/event-dashboard/incomplete-patients?page=2&limit=10&q=Ada'
    )
  })

  it('omits a blank search query', () => {
    getIncompletePatients({ q: '   ', page: 3, limit: 5 })

    expect(apiGet).toHaveBeenCalledWith('/event-dashboard/incomplete-patients?page=3&limit=5')
  })
})
