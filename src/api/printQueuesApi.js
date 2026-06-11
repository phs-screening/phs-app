import { apiGet, apiPost, apiPatch, apiDelete } from '../apiClient'

const withPagination = (path, options = {}) => {
  const params = new URLSearchParams()
  if (options.page) params.set('page', options.page)
  if (options.limit) params.set('limit', options.limit)
  const query = params.toString()
  return query ? `${path}?${query}` : path
}

export const getUnprintedDoctorPdfQueue = (options) =>
  apiGet(withPagination('/docPdfQueue', options))

export const getPrintedDoctorPdfQueue = (options) =>
  apiGet(withPagination('/docPdfQueue/printed', options))

export const addDoctorPdfQueueEntry = (patientId, doctorName) =>
  apiPost('/docPdfQueue', { patientId, doctorName })

export const markDoctorPdfPrinted = (id) => apiPatch(`/docPdfQueue/${id}`, {})

export const deleteDoctorPdfQueueEntry = (id) => apiDelete(`/docPdfQueue/${id}`)

export const getUnprintedFormAQueue = (options) => apiGet(withPagination('/formAPdfQueue', options))

export const getPrintedFormAQueue = (options) =>
  apiGet(withPagination('/formAPdfQueue/printed', options))

export const addFormAQueueEntry = (patientId) => apiPost('/formAPdfQueue', { patientId })

export const markFormAPrinted = (id) => apiPatch(`/formAPdfQueue/${id}`, {})

export const deleteFormAQueueEntry = (id) => apiDelete(`/formAPdfQueue/${id}`)
