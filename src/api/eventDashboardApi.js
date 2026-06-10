import { apiGet } from '../apiClient'

export function getEventDashboardSummary() {
  return apiGet('/event-dashboard/summary')
}

export function getIncompletePatients({ q = '', page = 1, limit = 25 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })

  if (q.trim()) {
    params.set('q', q.trim())
  }

  return apiGet(`/event-dashboard/incomplete-patients?${params.toString()}`)
}
