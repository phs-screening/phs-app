import { createPatient } from './patientsApi'
import { submitPatientForm } from './formsApi'
import { toFormKey } from '../forms/formKeys'
export { generateDoctorPdf } from '../reports/doctorPdf'
export { generateFormAPdf } from '../reports/formAPdf'
export {
  addBmi,
  addBloodPressure,
  addFollowUp,
  addMemos,
  addOtherScreeningModularities,
  addRecommendation,
  calculateY,
  followUpWith,
  generate_pdf,
  kNewlines,
  patient,
} from '../reports/patientReportPdf'
export {
  bloodPressureSection,
  bmiSection,
  followUpSection,
  generate_pdf_updated,
  memoSection,
  otherScreeningModularitiesSection,
  recommendationSection,
  temperatureSection,
} from '../reports/patientReportPdfUpdated'

// export async function preRegister(preRegArgs) {
//   let gender = preRegArgs.gender
//   let initials = preRegArgs.initials.trim()
//   let age = preRegArgs.age
//   let preferredLanguage = preRegArgs.preferredLanguage.trim()
//   let goingForPhlebotomy = preRegArgs.goingForPhlebotomy
//   // validate params
//   if (
//     gender == null ||
//     initials == null ||
//     age == null ||
//     preferredLanguage == null ||
//     goingForPhlebotomy == null
//   ) {
//     return { result: false, error: 'Function Arguments canot be undefined.' }
//   }
//   if (
//     typeof goingForPhlebotomy === 'string' &&
//     goingForPhlebotomy !== 'Y' &&
//     goingForPhlebotomy !== 'N'
//   ) {
//     return { result: false, error: 'The value of goingForPhlebotomy must either be "T" or "F"' }
//   }
//   // TODO: more exhaustive error handling. consider abstracting it in a validation function, and using schema validation
//   let data = {
//     gender: gender,
//     initials: initials,
//     age: age,
//     preferredLanguage: preferredLanguage,
//     goingForPhlebotomy: goingForPhlebotomy,
//   }
//   let isSuccess = false
//   let errorMsg = ''
//   try {
//     const mongoConnection = mongoDB.currentUser.mongoClient('mongodb-atlas')
//     const patientsRecord = mongoConnection.db('phs').collection('patients')
//     const qNum = await mongoDB.currentUser.functions.getNextQueueNo()
//     await patientsRecord.insertOne({ queueNo: qNum, ...data })
//     data = { patientId: qNum, ...data }
//     isSuccess = true
//   } catch (err) {
//     // TODO: more granular error handling
//     return { result: false, error: err }
//   }
//   return { result: isSuccess, data: data, error: errorMsg }
// }

// export async function submitForm(args, patientId, formCollection) {
//   try {
//     const mongoConnection = mongoDB.currentUser.mongoClient('mongodb-atlas')
//     const patientsRecord = mongoConnection.db('phs').collection('patients')
//     const registrationForms = mongoConnection.db('phs').collection(formCollection)
//     const record2 = await patientsRecord.findOne({ queueNo: patientId })

//     let qNum = 0

//     let gender = args.registrationQ5
//     let initials = args.registrationQ2
//     let age = args.registrationQ4
//     let preferredLanguage = args.registrationQ14
//     let goingForPhlebotomy = args.registrationQ15

//     let data = {
//       gender: gender,
//       initials: initials,
//       age: age,
//       preferredLanguage: preferredLanguage,
//       goingForPhlebotomy: goingForPhlebotomy,
//     }

//     console.log('patient id: ' + record2)

//     if (record2 == null) {
//       qNum = await mongoDB.currentUser.functions.getNextQueueNo()
//       await patientsRecord.insertOne({ queueNo: qNum, ...data })
//       patientId = qNum
//     }

//     const record = await patientsRecord.findOne({ queueNo: patientId })

//     if (record) {
//       // Adds a key-value pair for each form submitted for the first time to the patient's document in the patients collection
//       // in MongoDB to track which forms have been successfully submitted
//       if (record[formCollection] === undefined) {
//         await patientsRecord.updateOne(
//           { queueNo: patientId },
//           { $set: { [formCollection]: patientId } },
//         )

//         await registrationForms.insertOne({ _id: patientId, ...args })

//         await updateAllStationCounts(patientId)

//         await updateGeriGraceEligibility(args, patientId, formCollection)

//         return { result: true, data: data, qNum: patientId }
//       } else {
//         if (await isAdmin()) {
//           args.lastEdited = new Date()
//           args.lastEditedBy = getName()
//           await registrationForms.updateOne({ _id: patientId }, { $set: { ...args } })
//           if (formCollection == 'registrationForm') {
//             await patientsRecord.updateOne(
//               { queueNo: patientId },
//               { $set: { initials: args.registrationQ2 } },
//             )
//             await patientsRecord.updateOne(
//               { queueNo: patientId },
//               { $set: { age: args.registrationQ4 } },
//             )
//           }
//           await updateAllStationCounts(patientId)
//           await updateGeriGraceEligibility(args, patientId, formCollection, patientsRecord)
//           // replace form
//           // registrationForms.findOneAndReplace({_id: record[formCollection]}, args);
//           // throw error message
//           // const errorMsg = "This form has already been submitted. If you need to make "
//           //         + "any changes, please contact the admin."
//           return { result: true, data: data, qNum: patientId }
//         } else {
//           const errorMsg =
//             'This form has already been submitted. If you need to make ' +
//             'any changes, please contact the admin.'
//           return { result: false, error: errorMsg }
//         }
//       }
//     } else {
//       // TODO: throw error, not possible that no document is found
//       // unless malicious user tries to change link to directly access reg page
//       // Can check in every form page if there is valid patientId instead
//       // cannot use useEffect since the form component is class component
//       const errorMsg = 'An error has occurred.'
//       console.log('There is an error here')
//       // You will be directed to the registration page." logic not done
//       return { result: false, error: errorMsg }
//     }
//   } catch (err) {
//     return { result: false, error: err }
//   }
// }

const inFlightFormSubmissions = new Map()

function getFormSubmissionKey(patientId, formCollection) {
  return `${formCollection}:${patientId ?? 'new'}`
}

async function submitFormOnce(args, patientId, formCollection) {
  try {
    // Registers the patient in the patients collection if they do not exist yet
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

    // Upsert form data
    const upsert = await submitPatientForm(effectiveId, toFormKey(formCollection), args)
    if (!upsert?.result) return { result: false, error: 'Failed to save form' }

    // Return same shape expected by frontend logic
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

// Formats the response for the geri vision section
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

// export const deleteFromAllDatabase = async () => {
//   const mongoConnection = mongoDB.currentUser.mongoClient('mongodb-atlas')
//   const mongoDBConnection = mongoConnection.db('phs')

// console.log(await mongoDBConnection.collection("patients").deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.geriPtConsultForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.dietitiansConsultForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.doctorConsultForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.fitForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.geriAmtForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.geriEbasDepForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.geriFrailScaleForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.geriGeriApptForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.geriOtConsultForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.geriOtQuestionnaireForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.geriParQForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.geriMmseForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.geriPhysicalActivityLevelForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.geriAudiometryForm).deleteMany({}))
// console.log("half")
// console.log(await mongoDBConnection.collection(forms.geriSppbForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.phlebotomyForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.geriTugForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.geriVisionForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.hxCancerForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.hxHcsrForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.hxNssForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.hxSocialForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.phleboForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.registrationForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.oralHealthForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.socialServiceForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.wceForm).deleteMany({}))
// console.log('done')
// deletes volunteer accounts
// console.log(await mongoDBConnection.collection("profiles").deleteMany({is_admin:{$eq : undefined}}))

// console.log(await mongoDBConnection.collection("patients").deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.geriPtConsultForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.dietitiansConsultForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.doctorConsultForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.fitForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.geriAmtForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.geriEbasDepForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.geriFrailScaleForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.geriGeriApptForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.geriOtConsultForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.geriOtQuestionnaireForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.geriParQForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.geriMmseForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.geriPhysicalActivityLevelForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.geriAudiometryForm).deleteMany({}))
// console.log("half")
// console.log(await mongoDBConnection.collection(forms.geriSppbForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.phlebotomyForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.geriTugForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.geriVisionForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.hxCancerForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.hxHcsrForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.hxNssForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.hxSocialForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.phleboForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.registrationForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.oralHealthForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.socialServiceForm).deleteMany({}))
// console.log(await mongoDBConnection.collection(forms.wceForm).deleteMany({}))
// console.log('done')
// deletes volunteer accounts
// console.log(await mongoDBConnection.collection("profiles").deleteMany({is_admin:{$eq : undefined}}))
// }

