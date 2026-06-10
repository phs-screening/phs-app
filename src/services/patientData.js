import { getPatient, getPatientNames, searchPatientsByInitials } from '../api/patientsApi'
import { getPatientForm } from '../api/formsApi'
import { toFormKey } from '../forms/formKeys'
import { withRetry } from '../utils/retryRequest'

function logLoadFailure(label, error) {
  console.error(`${label}:`, error)
}

export const getPatientRecordStrict = async (patientId) => {
  const res = await withRetry(() => getPatient(patientId))
  return res.data || null
}

export const findPatientByInitialsStrict = async (initials) => {
  const res = await withRetry(() => searchPatientsByInitials(initials))
  return res.data || null
}

export const getPatientNamesListStrict = async (options) => {
  const res = await withRetry(() => getPatientNames(options))
  return res.data || []
}

export const getPatientRecord = async (patientId) => {
  try {
    return (await getPatientRecordStrict(patientId)) || {}
  } catch (error) {
    logLoadFailure(`Failed to load patient record ${patientId}`, error)
    return {}
  }
}

export const getPatientNamesList = async (options) => {
  try {
    return await getPatientNamesListStrict(options)
  } catch (error) {
    logLoadFailure('Failed to load patient names', error)
    return []
  }
}

export const findPatientByInitials = async (initials) => {
  try {
    return (await findPatientByInitialsStrict(initials)) || {}
  } catch (error) {
    logLoadFailure(`Failed to load patient by initials ${initials}`, error)
    return {}
  }
}

export const getPatientFormData = async (patientId, formCollectionOrKey) => {
  try {
    const res = await withRetry(() => getPatientForm(patientId, toFormKey(formCollectionOrKey)))
    return res.data || {}
  } catch (error) {
    logLoadFailure(
      `Failed to load form ${formCollectionOrKey} for patient ${patientId}`,
      error,
    )
    return {}
  }
}

export const getPatientFormDataStrict = async (patientId, formCollectionOrKey) => {
  const res = await withRetry(() => getPatientForm(patientId, toFormKey(formCollectionOrKey)))
  return res.data || null
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

export const getPreRegDataByIdStrict = async (patientId, resourceName) => {
  if (resourceName === 'patients') {
    return getPatientRecordStrict(patientId)
  }

  return getPatientFormDataStrict(patientId, resourceName)
}

export const getPreRegDataByNameStrict = async (initials, resourceName) => {
  if (resourceName === 'patients') {
    return findPatientByInitialsStrict(initials)
  }

  return null
}

export const getAllPatientNamesStrict = async (resourceName, options) => {
  if (resourceName === 'patients') {
    return getPatientNamesListStrict(options)
  }

  return []
}

export const getAllPatientNames = async (resourceName, options) => {
  if (resourceName === 'patients') {
    return getPatientNamesList(options)
  }

  return []
}
