import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiDelete, apiGet, apiPatch, apiPost } from '../../src/apiClient'
import {
  addPatientsToStationQueue,
  createStationQueue,
  deleteStationQueue,
  getNextPatientQueueNo,
  getQueueCounters,
  getQueueEntries,
  removeFirstPatientFromStationQueue,
  removePatientsFromStationQueue,
  updatePhlebotomyQueueCounter,
} from '../../src/api/queuesApi'

vi.mock('../../src/apiClient', () => ({
  apiDelete: vi.fn(),
  apiGet: vi.fn(),
  apiPatch: vi.fn(),
  apiPost: vi.fn(),
}))

describe('queuesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('gets queue metadata and next patient number', () => {
    getNextPatientQueueNo()
    getQueueEntries()
    getQueueCounters()

    expect(apiPost).toHaveBeenCalledWith('/queues/patients/next-number', {})
    expect(apiGet).toHaveBeenNthCalledWith(1, '/queues')
    expect(apiGet).toHaveBeenNthCalledWith(2, '/queue-counters')
  })

  it('updates the phlebotomy queue counter', () => {
    updatePhlebotomyQueueCounter(12)

    expect(apiPatch).toHaveBeenCalledWith('/queue-counters/phlebotomy', { seq: 12 })
  })

  it('creates and deletes station queues', () => {
    createStationQueue('Doctor Consult')
    deleteStationQueue('Doctor/Consult')

    expect(apiPost).toHaveBeenCalledWith('/queues/stations', {
      stationName: 'Doctor Consult',
    })
    expect(apiDelete).toHaveBeenCalledWith('/queues/stations/Doctor%2FConsult')
  })

  it('adds and removes patients from encoded station queues', () => {
    const queueItems = [{ patientId: 7 }]

    addPatientsToStationQueue('Doctor/Consult', queueItems)
    removePatientsFromStationQueue('Doctor/Consult', queueItems)
    removeFirstPatientFromStationQueue('Doctor/Consult')

    expect(apiPatch).toHaveBeenNthCalledWith(
      1,
      '/queues/stations/Doctor%2FConsult/items',
      { queueItems }
    )
    expect(apiPatch).toHaveBeenNthCalledWith(
      2,
      '/queues/stations/Doctor%2FConsult/items/remove',
      { queueItems }
    )
    expect(apiPatch).toHaveBeenNthCalledWith(
      3,
      '/queues/stations/Doctor%2FConsult/items/first',
      {}
    )
  })
})
