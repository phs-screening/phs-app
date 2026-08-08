import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  clearPersistedPatient,
  loadPersistedPatient,
  PATIENT_CLEARED_EVENT,
  savePersistedPatient,
} from '../../src/utils/patientPersistence'

describe('patientPersistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads an empty patient when nothing is persisted', () => {
    expect(loadPersistedPatient()).toEqual({ patientId: -1, patientInfo: {} })
  })

  it('saves and loads the selected patient', () => {
    const patientInfo = { queueNo: 123, initials: 'Ada', age: 45 }

    savePersistedPatient(123, patientInfo)

    expect(loadPersistedPatient()).toEqual({ patientId: 123, patientInfo })
  })

  it('clears the selected patient', () => {
    const listener = vi.fn()
    window.addEventListener(PATIENT_CLEARED_EVENT, listener)
    savePersistedPatient(123, { queueNo: 123 })

    clearPersistedPatient()

    expect(localStorage.getItem('selectedPatient')).toBeNull()
    expect(loadPersistedPatient()).toEqual({ patientId: -1, patientInfo: {} })
    expect(listener).toHaveBeenCalledTimes(1)
    window.removeEventListener(PATIENT_CLEARED_EVENT, listener)
  })

  it('can defer the cleared event until after the current render work', async () => {
    const listener = vi.fn()
    window.addEventListener(PATIENT_CLEARED_EVENT, listener)
    savePersistedPatient(123, { queueNo: 123 })

    clearPersistedPatient({ deferNotification: true })

    expect(localStorage.getItem('selectedPatient')).toBeNull()
    expect(listener).not.toHaveBeenCalled()

    await Promise.resolve()

    expect(listener).toHaveBeenCalledTimes(1)
    window.removeEventListener(PATIENT_CLEARED_EVENT, listener)
  })
})
