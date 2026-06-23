import { apiGet, apiPost } from '../apiClient'

export function createPatient(payload) {
  return apiPost('/patients', payload)
}

export function getPatient(patientId) {
  return apiGet(`/patients/${encodeURIComponent(patientId)}`)
}

export function getSummaryReportData(patientId) {
  return apiGet(`/patients/${encodeURIComponent(patientId)}/summary-report-data`)
}

export function getPatientNames({ q, page = 1, limit = 20 } = {}) {
  const params = new URLSearchParams()
  const search = String(q ?? '').trim()

  if (search) {
    params.set('q', search)
  }

  params.set('page', String(page))
  params.set('limit', String(limit))

  return apiGet(`/patients/names?${params.toString()}`)
}

export function searchPatientsByInitials(initials) {
  return apiGet(`/patients/search?initials=${encodeURIComponent(initials)}`)
}

export function getPatientNameMatches({ initials, page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams({
    initials: String(initials ?? '').trim(),
    page: String(page),
    limit: String(limit),
  })

  return apiGet(`/patients/name-matches?${params.toString()}`)
}
