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
} from '../api/printQueuesApi'
import { isLoggedin } from './authSession'

const queueResponse = (response) => ({
  items: response.data || [],
  pagination: response.pagination || null,
})

const maybePaginated = (response, options) => {
  const normalized = queueResponse(response)
  return options?.includePagination ? normalized : normalized.items
}

export const getUnprintedDocPdfQueue = async (options) => {
  if (!isLoggedin()) return options?.includePagination ? { items: [], pagination: null } : []
  const response = await getUnprintedDoctorPdfQueue(options)
  return maybePaginated(response, options)
}

export const getPrintedDocPdfQueue = async (options) => {
  if (!isLoggedin()) return options?.includePagination ? { items: [], pagination: null } : []
  const response = await getPrintedDoctorPdfQueue(options)
  return maybePaginated(response, options)
}

export const addToDocPdfQueue = async (patientId, doctorName) => {
  if (!isLoggedin()) return false
  await addDoctorPdfQueueEntry(patientId, doctorName)
  return true
}

export const markDocPdfAsPrinted = async (docId) => {
  if (!isLoggedin()) return false
  await markDoctorPdfPrinted(docId)
  return true
}

export const deleteDocPdfFromQueue = async (docId) => {
  if (!isLoggedin()) return false
  await deleteDoctorPdfQueueEntry(docId)
  return true
}

export const getUnprintedFormAPdfQueue = async (options) => {
  if (!isLoggedin()) return options?.includePagination ? { items: [], pagination: null } : []
  const response = await getUnprintedFormAQueue(options)
  return maybePaginated(response, options)
}

export const getPrintedFormAPdfQueue = async (options) => {
  if (!isLoggedin()) return options?.includePagination ? { items: [], pagination: null } : []
  const response = await getPrintedFormAQueue(options)
  return maybePaginated(response, options)
}

export const markFormAAsPrinted = async (docId) => {
  if (!isLoggedin()) return false
  await markFormAPrinted(docId)
  return true
}

export const deleteFormAFromQueue = async (docId) => {
  if (!isLoggedin()) return false
  await deleteFormAQueueEntry(docId)
  return true
}
