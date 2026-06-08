import { getPatient, getPatientNames, searchPatientsByInitials } from '../api/patientsApi'
import { getPatientForm } from '../api/formsApi'
import { toFormKey } from '../forms/formKeys'

export const getPatientRecord = async (patientId) => {
  try {
    const res = await getPatient(patientId)
    return res.data || {}
  } catch {
    return {}
  }
}

export const getPatientNamesList = async (options) => {
  try {
    const res = await getPatientNames(options)
    return res.data || []
  } catch {
    return []
  }
}

export const findPatientByInitials = async (initials) => {
  try {
    const res = await searchPatientsByInitials(initials)
    return res.data || {}
  } catch {
    return {}
  }
}

export const getPatientFormData = async (patientId, formCollectionOrKey) => {
  try {
    const res = await getPatientForm(patientId, toFormKey(formCollectionOrKey))
    return res.data || {}
  } catch {
    return {}
  }
}

// Compatibility aliases while form components migrate to domain names.
export const getSavedData = getPatientFormData

export const getSavedPatientData = async (patientId, resourceName) => {
  if (resourceName === 'patients') {
    return getPatientRecord(patientId)
  }

  return getPatientFormData(patientId, resourceName)
}

export const getPreRegDataById = async (patientId, resourceName) => {
  if (resourceName === 'patients') {
    return getPatientRecord(patientId)
  }

  return getPatientFormData(patientId, resourceName)
}

export const getPreRegDataByName = async (initials, resourceName) => {
  if (resourceName === 'patients') {
    return findPatientByInitials(initials)
  }

  return {}
}

export const getAllPatientNames = async (resourceName, options) => {
  if (resourceName === 'patients') {
    return getPatientNamesList(options)
  }

  return []
}
