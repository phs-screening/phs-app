const STORAGE_KEY = 'selectedPatient'
export const PATIENT_CLEARED_EVENT = 'patient-selection-cleared'

export function loadPersistedPatient() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return { patientId: -1, patientInfo: {} }
    }

    const parsed = JSON.parse(raw)
    return {
      patientId: parsed.patientId ?? -1,
      patientInfo: parsed.patientInfo ?? {},
    }
  } catch {
    return { patientId: -1, patientInfo: {} }
  }
}

export function savePersistedPatient(patientId, patientInfo = {}) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ patientId, patientInfo }),
  )
}

export function clearPersistedPatient({ deferNotification = false } = {}) {
  localStorage.removeItem(STORAGE_KEY)
  const notifyPatientCleared = () => window.dispatchEvent(new Event(PATIENT_CLEARED_EVENT))

  if (deferNotification) {
    queueMicrotask(notifyPatientCleared)
    return
  }

  notifyPatientCleared()
}
