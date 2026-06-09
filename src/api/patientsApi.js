import { apiGet, apiPost } from '../apiClient'

export function createPatient(payload) {
  return apiPost('/patients', payload)
}

export function getPatient(patientId) {
  return apiGet(`/patients/${encodeURIComponent(patientId)}`)
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
