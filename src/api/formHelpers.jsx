import React from 'react'
import { createPatient } from './patientsApi'
import { submitPatientForm } from './formsApi'
import { toFormKey } from '../forms/formKeys'

const inFlightFormSubmissions = new Map()

function getFormSubmissionKey(patientId, formCollection) {
  return `${formCollection}:${patientId ?? 'new'}`
}

async function submitFormOnce(args, patientId, formCollection) {
  try {
    let effectiveId = patientId
    let patientData = {}

    if (effectiveId === -1 || effectiveId == null) {
      const payload = {
        gender: args.registrationQ5,
        initials: (args.registrationQ2 || '').trim(),
        age: Number(args.registrationQ4 ?? 0),
        preferredLanguage: (args.registrationQ14 || '').trim(),
      }
      const created = await createPatient(payload)
      if (!created?.result) return { result: false, error: 'Failed to create patient' }
      effectiveId = created.data.queueNo
      patientData = payload
    } else {
      patientData = {
        gender: args.registrationQ5,
        initials: args.registrationQ2,
        age: args.registrationQ4,
        preferredLanguage: args.registrationQ14,
      }
    }

    const upsert = await submitPatientForm(effectiveId, toFormKey(formCollection), args)
    if (!upsert?.result) return { result: false, error: 'Failed to save form' }

    return {
      result: true,
      data: patientData,
      qNum: effectiveId,
    }
  } catch (err) {
    return { result: false, error: err.message || String(err) }
  }
}

export async function submitForm(args, patientId, formCollection) {
  const submissionKey = getFormSubmissionKey(patientId, formCollection)
  const inFlightSubmission = inFlightFormSubmissions.get(submissionKey)

  if (inFlightSubmission) {
    return inFlightSubmission
  }

  const submission = submitFormOnce(args, patientId, formCollection).finally(() => {
    inFlightFormSubmissions.delete(submissionKey)
  })

  inFlightFormSubmissions.set(submissionKey, submission)
  return submission
}

export function formatBmi(heightInCm, weightInKg) {
  const bmi = calculateBMI(heightInCm, weightInKg)

  if (bmi > 27.5) {
    return (
      <p className='summary--red-text'>
        {bmi}
        <br />
        BMI is obese
      </p>
    )
  } else if (bmi >= 23.0) {
    return (
      <p className='summary--red-text'>
        {bmi}
        <br />
        BMI is overweight
      </p>
    )
  } else if (bmi < 18.5) {
    return (
      <p className='summary--red-text'>
        {bmi}
        <br />
        BMI is underweight
      </p>
    )
  } else {
    return <p className='summary--blue-text'>{bmi}</p>
  }
}

export function calculateBMI(heightInCm, weightInKg) {
  const height = heightInCm / 100
  const bmi = (weightInKg / height / height).toFixed(1)

  return bmi
}

export const formatGeriVision = (acuityString, questionNo) => {
  const acuity = parseInt(acuityString)
  if (acuity >= 6) {
    return <p className='summary--red-text'>{parseGeriVision(acuity, questionNo)}</p>
  }
  if (questionNo === 6) {
    return <p className='summary--red-text'>{parseGeriVision(acuity, questionNo)}</p>
  }
  return <p className='summary--blue-text'>{parseGeriVision(acuity, questionNo)}</p>
}

export function parseGeriVision(acuity, questionNo) {
  var result
  var additionalInfo

  switch (questionNo) {
    case 3:
    case 4:
      if (acuity >= 6) {
        additionalInfo = '\nSee VA with pinhole'
        result = 'Visual acuity (w/o pinhole occluder) - Right Eye 6/' + acuity + additionalInfo
      } else {
        result = 'Visual acuity (w/o pinhole occluder) - Left Eye 6/' + acuity
      }
      return result
    case 5:
    case 6:
      if (acuity >= 6) {
        result = 'Visual acuity (with pinhole occluder) - Right Eye 6/' + acuity
        additionalInfo = '\nNon-refractive error, participant should have consulted on-site doctor'
      } else {
        result = 'Visual acuity (with pinhole occluder) - Left Eye 6/' + acuity
        additionalInfo =
          '\nRefractive error, participant can opt to apply for Senior Mobility Fund (SMF)'
      }
      result = result + additionalInfo
      return result
    default:
      return ''
  }
}

export const formatWceStation = (gender, question, answer) => {
  if (gender == 'Male' || gender == 'Not Applicable') {
    return '-'
  }
  return (
    <div>
      <p className='summary--blue-text'>{parseWceStation(question, answer).result}</p>
      <p className='summary--red-text'>{parseWceStation(question, answer).additionalInfo}</p>
    </div>
  )
}

export function parseWceStation(question, answer) {
  var result = { result: answer, additionalInfo: null }
  var additionalInfo
  switch (question) {
    case 2:
    case 3:
      additionalInfo =
        'If participant is interested in WCE, check whether they have' +
        'completed the station. Referring to the responses below, please check with them if the relevant appointments have been made based on their indicated interests.'
      break
    case 4:
      if (answer == 'Yes') {
        additionalInfo = 'Kindly remind participant that SCS will be contacting them.'
      }
      break
    case 5:
      if (answer == 'Yes') {
        additionalInfo = 'Kindly remind participant that SCS will be contacting them.'
      }
      break
    case 6:
      if (answer == 'Yes') {
        additionalInfo = 'Kindly remind participant that NHGD will be contacting them.'
      }
      break
  }
  result.additionalInfo = additionalInfo

  return result
}

export function calculateSppbScore(q2, q6, q8) {
  let score = 0
  if (q2 !== undefined) {
    score += parseInt(q2.slice(0))
  }
  if (q6 !== undefined) {
    const num = parseInt(q6.slice(0))
    if (!Number.isNaN(num)) {
      score += num
    }
  }
  if (q8 !== undefined) {
    score += parseInt(q8.slice(0))
  }
  return score
}

export const regexPasswordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/
