import {
  checkInPreRegistration,
  getPatientPreRegistrationPrefill,
  getPreRegistrationByQueue,
  searchPreRegistrations,
} from '../api/preRegistrationsApi'
import { withRetry } from '../utils/retryRequest'

export async function findPreRegistrationByQueueStrict(queueNo) {
  try {
    const response = await withRetry(() => getPreRegistrationByQueue(queueNo))
    return response.data || null
  } catch (error) {
    if (error?.status === 404) return null
    throw error
  }
}

export async function searchPreRegistrationsStrict(options) {
  const response = await withRetry(() => searchPreRegistrations(options))
  return {
    data: response.data || [],
    pagination: response.pagination || null,
  }
}

export async function checkInPreRegistrationStrict(queueNo) {
  const response = await checkInPreRegistration(queueNo)
  return response.data
}

export async function getPatientPreRegistrationPrefillStrict(patientId) {
  const response = await withRetry(() =>
    getPatientPreRegistrationPrefill(patientId),
  )
  return response.data || null
}
