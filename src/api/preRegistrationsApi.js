import { apiGet, apiPost } from '../apiClient'

export function getPreRegistrationByQueue(queueNo) {
  return apiGet(
    `/pre-registrations/by-queue/${encodeURIComponent(queueNo)}`,
  )
}

export function searchPreRegistrations({ initials, page = 1, limit = 10 }) {
  const params = new URLSearchParams({
    initials: String(initials ?? '').trim(),
    page: String(page),
    limit: String(limit),
  })

  return apiGet(`/pre-registrations/search?${params.toString()}`)
}

export function checkInPreRegistration(queueNo) {
  return apiPost(
    `/pre-registrations/${encodeURIComponent(queueNo)}/check-in`,
    {},
  )
}

export function getPatientPreRegistrationPrefill(patientId) {
  return apiGet(
    `/patients/${encodeURIComponent(patientId)}/pre-registration-prefill`,
  )
}
