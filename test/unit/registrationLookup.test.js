import { describe, expect, it } from 'vitest'
import {
  mergeRegistrationMatches,
  REGISTRATION_LOOKUP_ACTIONS,
  resolveRegistrationLookup,
} from '../../src/services/registrationLookup'

const patient = { queueNo: 22, initials: 'Yeo Z W D' }

describe('registrationLookup', () => {
  it.each([
    [null, null, REGISTRATION_LOOKUP_ACTIONS.notFound],
    [patient, null, REGISTRATION_LOOKUP_ACTIONS.openDashboard],
    [null, { status: 'available' }, REGISTRATION_LOOKUP_ACTIONS.confirmCheckIn],
    [patient, { status: 'available' }, REGISTRATION_LOOKUP_ACTIONS.resumeRegistration],
    [null, { status: 'checking_in' }, REGISTRATION_LOOKUP_ACTIONS.checkInInProgress],
    [patient, { status: 'checking_in' }, REGISTRATION_LOOKUP_ACTIONS.resumeRegistration],
    [null, { status: 'checked_in' }, REGISTRATION_LOOKUP_ACTIONS.dataError],
    [patient, { status: 'checked_in' }, REGISTRATION_LOOKUP_ACTIONS.resumeRegistration],
    [null, { status: 'completed' }, REGISTRATION_LOOKUP_ACTIONS.dataError],
    [patient, { status: 'completed' }, REGISTRATION_LOOKUP_ACTIONS.openDashboard],
    [null, { status: 'unknown' }, REGISTRATION_LOOKUP_ACTIONS.dataError],
  ])(
    'resolves patient %j and pre-registration %j to %s',
    (patientRecord, preRegistration, expected) => {
      expect(resolveRegistrationLookup(patientRecord, preRegistration)).toBe(expected)
    },
  )

  it('treats a submitted Registration form as complete even if staging status is stale', () => {
    expect(
      resolveRegistrationLookup({ ...patient, registrationForm: 22 }, { status: 'checked_in' }),
    ).toBe(REGISTRATION_LOOKUP_ACTIONS.openDashboard)
  })

  it('merges patient and pre-registration matches by queue number', () => {
    expect(
      mergeRegistrationMatches(
        [patient, { queueNo: 23, initials: 'Existing' }],
        [
          { queueNo: 22, initials: 'Yeo Z W D', status: 'checked_in' },
          { queueNo: 24, initials: 'New P', status: 'available' },
        ],
      ),
    ).toEqual([
      expect.objectContaining({
        queueNo: 22,
        action: REGISTRATION_LOOKUP_ACTIONS.resumeRegistration,
        patient,
        preRegistration: expect.objectContaining({ status: 'checked_in' }),
      }),
      expect.objectContaining({
        queueNo: 23,
        action: REGISTRATION_LOOKUP_ACTIONS.openDashboard,
      }),
      expect.objectContaining({
        queueNo: 24,
        action: REGISTRATION_LOOKUP_ACTIONS.confirmCheckIn,
        patient: null,
      }),
    ])
  })
})
