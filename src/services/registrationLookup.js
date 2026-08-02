export const REGISTRATION_LOOKUP_ACTIONS = {
  confirmCheckIn: 'confirm_check_in',
  resumeRegistration: 'resume_registration',
  openDashboard: 'open_dashboard',
  checkInInProgress: 'check_in_in_progress',
  notFound: 'not_found',
  dataError: 'data_error',
}

export function resolveRegistrationLookup(patient, preRegistration) {
  if (patient?.registrationForm !== undefined) {
    return REGISTRATION_LOOKUP_ACTIONS.openDashboard
  }

  if (!preRegistration) {
    return patient
      ? REGISTRATION_LOOKUP_ACTIONS.openDashboard
      : REGISTRATION_LOOKUP_ACTIONS.notFound
  }

  if (preRegistration.status === 'completed') {
    return patient
      ? REGISTRATION_LOOKUP_ACTIONS.openDashboard
      : REGISTRATION_LOOKUP_ACTIONS.dataError
  }

  if (preRegistration.status === 'checked_in') {
    return patient
      ? REGISTRATION_LOOKUP_ACTIONS.resumeRegistration
      : REGISTRATION_LOOKUP_ACTIONS.dataError
  }

  if (preRegistration.status === 'checking_in') {
    return patient
      ? REGISTRATION_LOOKUP_ACTIONS.resumeRegistration
      : REGISTRATION_LOOKUP_ACTIONS.checkInInProgress
  }

  if (preRegistration.status === 'available') {
    return patient
      ? REGISTRATION_LOOKUP_ACTIONS.resumeRegistration
      : REGISTRATION_LOOKUP_ACTIONS.confirmCheckIn
  }

  return REGISTRATION_LOOKUP_ACTIONS.dataError
}

export function mergeRegistrationMatches(patients, preRegistrations) {
  const preRegistrationsByQueue = new Map(
    preRegistrations.map((preRegistration) => [String(preRegistration.queueNo), preRegistration]),
  )

  const matches = patients.map((patient) => {
    const key = String(patient.queueNo)
    const preRegistration = preRegistrationsByQueue.get(key) || null
    preRegistrationsByQueue.delete(key)

    return {
      queueNo: patient.queueNo,
      initials: preRegistration?.initials || patient.initials,
      birthday: preRegistration?.birthday || patient.birthday,
      patient,
      preRegistration,
      action: resolveRegistrationLookup(patient, preRegistration),
    }
  })

  for (const preRegistration of preRegistrationsByQueue.values()) {
    matches.push({
      queueNo: preRegistration.queueNo,
      initials: preRegistration.initials,
      birthday: preRegistration.birthday,
      patient: null,
      preRegistration,
      action: resolveRegistrationLookup(null, preRegistration),
    })
  }

  return matches
}
