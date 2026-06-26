import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiDelete, apiGet, apiPatch, apiPost } from '../../src/apiClient'
import {
  addDoctorPdfQueueEntry,
  addFormAQueueEntry,
  deleteDoctorPdfQueueEntry,
  deleteFormAQueueEntry,
  getPrintedDoctorPdfQueue,
  getPrintedFormAQueue,
  getUnprintedDoctorPdfQueue,
  getUnprintedFormAQueue,
  markDoctorPdfPrinted,
  markFormAPrinted,
} from '../../src/api/printQueuesApi'

vi.mock('../../src/apiClient', () => ({
  apiDelete: vi.fn(),
  apiGet: vi.fn(),
  apiPatch: vi.fn(),
  apiPost: vi.fn(),
}))

describe('printQueuesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('gets doctor PDF queues with optional pagination', () => {
    getUnprintedDoctorPdfQueue()
    getPrintedDoctorPdfQueue({ page: 2, limit: 50 })

    expect(apiGet).toHaveBeenNthCalledWith(1, '/docPdfQueue')
    expect(apiGet).toHaveBeenNthCalledWith(2, '/docPdfQueue/printed?page=2&limit=50')
  })

  it('mutates doctor PDF queue entries', () => {
    addDoctorPdfQueueEntry(7, 'Dr Tan')
    markDoctorPdfPrinted(3)
    deleteDoctorPdfQueueEntry(3)

    expect(apiPost).toHaveBeenCalledWith('/docPdfQueue', {
      patientId: 7,
      doctorName: 'Dr Tan',
    })
    expect(apiPatch).toHaveBeenCalledWith('/docPdfQueue/3', {})
    expect(apiDelete).toHaveBeenCalledWith('/docPdfQueue/3')
  })

  it('gets Form A queues with optional pagination', () => {
    getUnprintedFormAQueue({ page: 1 })
    getPrintedFormAQueue({ limit: 25 })

    expect(apiGet).toHaveBeenNthCalledWith(1, '/formAPdfQueue?page=1')
    expect(apiGet).toHaveBeenNthCalledWith(2, '/formAPdfQueue/printed?limit=25')
  })

  it('mutates Form A queue entries', () => {
    addFormAQueueEntry(7)
    markFormAPrinted(4)
    deleteFormAQueueEntry(4)

    expect(apiPost).toHaveBeenCalledWith('/formAPdfQueue', { patientId: 7 })
    expect(apiPatch).toHaveBeenCalledWith('/formAPdfQueue/4', {})
    expect(apiDelete).toHaveBeenCalledWith('/formAPdfQueue/4')
  })
})
