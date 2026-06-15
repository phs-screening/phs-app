import { apiGet, apiPatch, apiPost, apiDelete } from '../apiClient'

export function getNextPatientQueueNo() {
  return apiPost('/queues/patients/next-number', {})
}

export function getQueueEntries() {
  return apiGet('/queues')
}

export function getQueueCounters() {
  return apiGet('/queue-counters')
}

export function updatePhlebotomyQueueCounter(seq) {
  return apiPatch('/queue-counters/phlebotomy', { seq })
}

export function createStationQueue(stationName) {
  return apiPost('/queues/stations', { stationName })
}

export function deleteStationQueue(stationName) {
  return apiDelete(`/queues/stations/${encodeURIComponent(stationName)}`)
}

export function addPatientsToStationQueue(stationName, queueItems) {
  return apiPatch(`/queues/stations/${encodeURIComponent(stationName)}/items`, { queueItems })
}

export function removePatientsFromStationQueue(stationName, queueItems) {
  return apiPatch(`/queues/stations/${encodeURIComponent(stationName)}/items/remove`, { queueItems })
}

export function removeFirstPatientFromStationQueue(stationName) {
  return apiPatch(`/queues/stations/${encodeURIComponent(stationName)}/items/first`, {})
}

export function restoreLastRemovedToFront(stationName) {
  return apiPatch(
    `/queues/stations/${encodeURIComponent(stationName)}/items/restore-last-removed`,
    {},
  )
}
