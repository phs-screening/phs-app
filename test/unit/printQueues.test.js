import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  addDoctorPdfQueueEntry,
  deleteDoctorPdfQueueEntry,
  deleteFormAQueueEntry,
  getPrintedDoctorPdfQueue,
  getPrintedFormAQueue,
  getUnprintedDoctorPdfQueue,
  getUnprintedFormAQueue,
  markDoctorPdfPrinted,
  markFormAPrinted,
} from '../../src/api/printQueuesApi'
import { isLoggedin } from '../../src/services/authSession'
import {
  addToDocPdfQueue,
  deleteDocPdfFromQueue,
  deleteFormAFromQueue,
  getPrintedDocPdfQueue,
  getPrintedFormAPdfQueue,
  getUnprintedDocPdfQueue,
  getUnprintedFormAPdfQueue,
  markDocPdfAsPrinted,
  markFormAAsPrinted,
} from '../../src/services/printQueues'

vi.mock('../../src/api/printQueuesApi', () => ({
  addDoctorPdfQueueEntry: vi.fn(),
  deleteDoctorPdfQueueEntry: vi.fn(),
  deleteFormAQueueEntry: vi.fn(),
  getPrintedDoctorPdfQueue: vi.fn(),
  getPrintedFormAQueue: vi.fn(),
  getUnprintedDoctorPdfQueue: vi.fn(),
  getUnprintedFormAQueue: vi.fn(),
  markDoctorPdfPrinted: vi.fn(),
  markFormAPrinted: vi.fn(),
}))

vi.mock('../../src/services/authSession', () => ({
  isLoggedin: vi.fn(),
}))

describe('printQueues', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns empty queue values when logged out', async () => {
    isLoggedin.mockReturnValue(false)

    await expect(getUnprintedDocPdfQueue()).resolves.toEqual([])
    await expect(getPrintedDocPdfQueue({ includePagination: true })).resolves.toEqual({
      items: [],
      pagination: null,
    })
    await expect(getUnprintedFormAPdfQueue()).resolves.toEqual([])
    await expect(getPrintedFormAPdfQueue({ includePagination: true })).resolves.toEqual({
      items: [],
      pagination: null,
    })

    expect(getUnprintedDoctorPdfQueue).not.toHaveBeenCalled()
    expect(getPrintedDoctorPdfQueue).not.toHaveBeenCalled()
    expect(getUnprintedFormAQueue).not.toHaveBeenCalled()
    expect(getPrintedFormAQueue).not.toHaveBeenCalled()
  })

  it('normalizes doctor PDF queue responses', async () => {
    isLoggedin.mockReturnValue(true)
    getUnprintedDoctorPdfQueue.mockResolvedValue({
      data: [{ id: 1 }],
      pagination: { page: 1 },
    })
    getPrintedDoctorPdfQueue.mockResolvedValue({
      data: [{ id: 2 }],
      pagination: { page: 2 },
    })

    await expect(getUnprintedDocPdfQueue()).resolves.toEqual([{ id: 1 }])
    await expect(getPrintedDocPdfQueue({ includePagination: true })).resolves.toEqual({
      items: [{ id: 2 }],
      pagination: { page: 2 },
    })
  })

  it('normalizes Form A queue responses', async () => {
    isLoggedin.mockReturnValue(true)
    getUnprintedFormAQueue.mockResolvedValue({
      data: [{ id: 3 }],
      pagination: { page: 3 },
    })
    getPrintedFormAQueue.mockResolvedValue({})

    await expect(getUnprintedFormAPdfQueue({ includePagination: true })).resolves.toEqual({
      items: [{ id: 3 }],
      pagination: { page: 3 },
    })
    await expect(getPrintedFormAPdfQueue()).resolves.toEqual([])
  })

  it('does not mutate queues when logged out', async () => {
    isLoggedin.mockReturnValue(false)

    await expect(addToDocPdfQueue(7, 'Dr Tan')).resolves.toBe(false)
    await expect(markDocPdfAsPrinted(1)).resolves.toBe(false)
    await expect(deleteDocPdfFromQueue(1)).resolves.toBe(false)
    await expect(markFormAAsPrinted(2)).resolves.toBe(false)
    await expect(deleteFormAFromQueue(2)).resolves.toBe(false)

    expect(addDoctorPdfQueueEntry).not.toHaveBeenCalled()
    expect(markDoctorPdfPrinted).not.toHaveBeenCalled()
    expect(deleteDoctorPdfQueueEntry).not.toHaveBeenCalled()
    expect(markFormAPrinted).not.toHaveBeenCalled()
    expect(deleteFormAQueueEntry).not.toHaveBeenCalled()
  })

  it('calls queue mutation APIs when logged in', async () => {
    isLoggedin.mockReturnValue(true)

    await expect(addToDocPdfQueue(7, 'Dr Tan')).resolves.toBe(true)
    await expect(markDocPdfAsPrinted(1)).resolves.toBe(true)
    await expect(deleteDocPdfFromQueue(1)).resolves.toBe(true)
    await expect(markFormAAsPrinted(2)).resolves.toBe(true)
    await expect(deleteFormAFromQueue(2)).resolves.toBe(true)

    expect(addDoctorPdfQueueEntry).toHaveBeenCalledWith(7, 'Dr Tan')
    expect(markDoctorPdfPrinted).toHaveBeenCalledWith(1)
    expect(deleteDoctorPdfQueueEntry).toHaveBeenCalledWith(1)
    expect(markFormAPrinted).toHaveBeenCalledWith(2)
    expect(deleteFormAQueueEntry).toHaveBeenCalledWith(2)
  })
})
