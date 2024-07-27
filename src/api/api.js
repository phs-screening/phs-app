import React from 'react'
import mongoDB, { getName, isAdmin, getClinicSlotsCollection } from '../services/mongoDB'
import { jsPDF } from 'jspdf'
import { defaultSlots } from 'src/forms/RegForm'
import logo from 'src/icons/Icon'
import {bloodpressureQR, bmiQR} from 'src/icons/QRCodes'
import 'jspdf-autotable'
import { parseFromLangKey } from './langutil'

const axios = require('axios').default

export async function preRegister(preRegArgs) {
  let gender = preRegArgs.gender
  let initials = preRegArgs.initials.trim()
  let age = preRegArgs.age
  let preferredLanguage = preRegArgs.preferredLanguage.trim()
  let goingForPhlebotomy = preRegArgs.goingForPhlebotomy
  // validate params
  if (
    gender == null ||
    initials == null ||
    age == null ||
    preferredLanguage == null ||
    goingForPhlebotomy == null
  ) {
    return { result: false, error: 'Function Arguments canot be undefined.' }
  }
  if (
    typeof goingForPhlebotomy === 'string' &&
    goingForPhlebotomy !== 'Y' &&
    goingForPhlebotomy !== 'N'
  ) {
    return { result: false, error: 'The value of goingForPhlebotomy must either be "T" or "F"' }
  }
  // TODO: more exhaustive error handling. consider abstracting it in a validation function, and using schema validation
  let data = {
    gender: gender,
    initials: initials,
    age: age,
    preferredLanguage: preferredLanguage,
    goingForPhlebotomy: goingForPhlebotomy,
  }
  let isSuccess = false
  let errorMsg = ''
  try {
    const mongoConnection = mongoDB.currentUser.mongoClient('mongodb-atlas')
    const patientsRecord = mongoConnection.db('phs').collection('patients')
    const qNum = await mongoDB.currentUser.functions.getNextQueueNo()
    await patientsRecord.insertOne({ queueNo: qNum, ...data })
    data = { patientId: qNum, ...data }
    isSuccess = true
  } catch (err) {
    // TODO: more granular error handling
    return { result: false, error: err }
  }
  return { result: isSuccess, data: data, error: errorMsg }
}

export async function submitForm(args, patientId, formCollection) {
  try {
    const mongoConnection = mongoDB.currentUser.mongoClient('mongodb-atlas')
    const patientsRecord = mongoConnection.db('phs').collection('patients')
    const registrationForms = mongoConnection.db('phs').collection(formCollection)
    const record2 = await patientsRecord.findOne({ queueNo: patientId })

    let qNum = 0

    let gender = args.registrationQ5
    let initials = args.registrationQ2
    let age = args.registrationQ4
    let preferredLanguage = args.registrationQ14
    let goingForPhlebotomy = args.registrationQ15

    let data = {
      gender: gender,
      initials: initials,
      age: age,
      preferredLanguage: preferredLanguage,
      goingForPhlebotomy: goingForPhlebotomy,
    }

    console.log("patient id: " + record2)
    if (record2 == null) { 
      qNum = await mongoDB.currentUser.functions.getNextQueueNo()
      await patientsRecord.insertOne({ queueNo: qNum, ...data })
      patientId = qNum
    }

    const record = await patientsRecord.findOne({ queueNo: patientId })

    if (record) {
      if (record[formCollection] === undefined) {
        // first time form is filled, create document for form
        await patientsRecord.updateOne(
          { queueNo: patientId },
          { $set: { [formCollection]: patientId } },
        )
        
        await registrationForms.insertOne({ _id: patientId, ...args })
        return { result: true, data: data , qNum: patientId}
      } else {
        if (await isAdmin()) {
          args.lastEdited = new Date()
          args.lastEditedBy = getName()
          await registrationForms.updateOne({ _id: patientId }, { $set: { ...args } })
          // replace form
          // registrationForms.findOneAndReplace({_id: record[formCollection]}, args);
          // throw error message
          // const errorMsg = "This form has already been submitted. If you need to make "
          //         + "any changes, please contact the admin."
          return { result: true, data: data, qNum: patientId}
        } else {
          const errorMsg =
            'This form has already been submitted. If you need to make ' +
            'any changes, please contact the admin.'
          return { result: false, error: errorMsg }
        }
      }
    } else {
      // TODO: throw error, not possible that no document is found
      // unless malicious user tries to change link to directly access reg page
      // Can check in every form page if there is valid patientId instead
      // cannot use useEffect since the form component is class component
      const errorMsg = 'An error has occurred.'
      console.log("There is an error here")
      // You will be directed to the registration page." logic not done
      return { result: false, error: errorMsg }
    }
  } catch (err) {
    return { result: false, error: err }
  }
}

export async function submitFormSpecial(args, patientId, formCollection) {
  try {
    const mongoConnection = mongoDB.currentUser.mongoClient('mongodb-atlas')
    const patientsRecord = mongoConnection.db('phs').collection('patients')
    const record = await patientsRecord.findOne({ queueNo: patientId })
    if (record) {
      const registrationForms = mongoConnection.db('phs').collection(formCollection)
      if (record[formCollection] === undefined) {
        // first time form is filled, create document for form
        await patientsRecord.updateOne(
          { queueNo: patientId },
          { $set: { [formCollection]: patientId } },
        )
        await registrationForms.insertOne({ _id: patientId, ...args })
        return { result: true }
      } else {
        args.lastEdited = new Date()
        args.lastEditedBy = getName()
        await registrationForms.updateOne({ _id: patientId }, { $set: { ...args } })

        return { result: true }
      }
    } else {
      const errorMsg = 'An error has occurred.'
      return { result: false, error: errorMsg }
    }
  } catch (err) {
    return { result: false, error: err }
  }
}

export async function submitRegClinics(postalCode, patientId) {
  const clinicSlotsCollection = getClinicSlotsCollection()
  // Check if the limit has been reached yet for the clinic
  const clinicSlots = await clinicSlotsCollection.findOne({ postalCode })
  if (clinicSlots) {
    const maxSlots = defaultSlots[postalCode]
    const currentSlots = clinicSlots.counterItems.length
    if (currentSlots >= maxSlots) {
      return { result: false, error: 'No more slots available for this location' }
    }
  }

  await clinicSlotsCollection.findOneAndUpdate(
    { postalCode },
    { $push: { counterItems: patientId } },
    { upsert: true },
  )

  const mongoConnection = mongoDB.currentUser.mongoClient('mongodb-atlas')
  const registrationFormRecords = mongoConnection.db('phs').collection('registrationForm')
  const patientRegForm = await registrationFormRecords.findOne({ _id: patientId })

  try {
    if (patientRegForm && patientRegForm.registrationQ10) {
      const location = patientRegForm.registrationQ10.trim()
      const prevPostalCode = location === 'None' ? location : location.slice(-6)
      await clinicSlotsCollection.findOneAndUpdate(
        {
          postalCode: prevPostalCode,
        },
        {
          $pull: { counterItems: patientId },
        },
      )
    }
    return { result: true }
  } catch (error) {
    return { result: false, error: error.message }
  }
}

export async function submitPreRegForm(args, patientId, formCollection) {
  try {
    const mongoConnection = mongoDB.currentUser.mongoClient('mongodb-atlas')
    const patientsRecord = mongoConnection.db('phs').collection(formCollection)
    const record = await patientsRecord.findOne({ queueNo: patientId })
    if (record) {
      if (await isAdmin()) {
        args.lastEdited = new Date()
        args.lastEditedBy = getName()
        await patientsRecord.updateOne({ queueNo: patientId }, { $set: { ...args } })
        return { result: true, data: args }
      } else {
        const errorMsg =
          'This form has already been submitted. If you need to make ' +
          'any changes, please contact the admin.'
        return { result: false, error: errorMsg }
      }
    } else {
      const errorMsg = 'An error has occurred.'
      return { result: false, error: errorMsg }
    }
  } catch (e) {
    return { result: false, error: e }
  }
}

// Provides general information about the kinds of forms that are supported
export async function getFormInfo() {
  try {
    var response = await axios.get(`/api/forms/info`)
  } catch (err) {
    // TODO: more granular error handling
    return { result: false, error: err }
  }
  return { result: true, data: response.data.data }
}

// retrieve completion status of all forms. green for completed, red for not complete, and amber for incomplete
export async function getFormStatus(userID) {
  userID = parseInt(userID)
  if (Number.isNaN(userID)) {
    return { result: false, error: 'User ID cannot be undefined.' }
  }
  try {
    var response = await axios.get(`/api/users/${userID}/status`)
  } catch (err) {
    // TODO: more granular error handling
    return { result: false, error: err }
  }
  return { result: true, data: response.data }
}

// retrieve specific form data
export async function getIndividualFormData(userID, form) {
  userID = parseInt(userID)
  if (Number.isNaN(userID)) {
    return { result: false, error: 'User ID cannot be undefined.' }
  }
  // TODO: use getFormInfo() to validate form name
  try {
    var response = await axios.get(`/api/users/${userID}/forms/${form}`)
  } catch (err) {
    // TODO: more granular error handling
    return { result: false, error: err }
  }
  return { result: true, data: response.data }
}

// retrieve all form data
export async function getAllFormData(userID) {
  userID = parseInt(userID)
  if (Number.isNaN(userID)) {
    return { result: false, error: 'User ID cannot be undefined.' }
  }
  try {
    var response = await axios.get(`/api/users/${userID}/forms`)
  } catch (err) {
    // TODO: more granular error handling
    return { result: false, error: err }
  }
  return { result: true, data: response.data }
}

// update or insert (upsert) data for a specified form
export async function upsertIndividualFormData(userID, form_name, form_data) {
  userID = parseInt(userID)
  if (Number.isNaN(userID)) {
    return { result: false, error: 'User ID cannot be undefined.' }
  }
  // TODO: use getFormInfo() to validate form name.
  try {
    var response = await axios.post(`/api/users/${userID}/forms/${form_name}`, {
      form_data: JSON.stringify(form_data),
    })
  } catch (err) {
    // TODO: more granular error handling
    return { result: false, error: err }
  }
  return { result: true, data: response.data }
}

// Calcuates the BMI
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

export function kNewlines(k) {
  const newline = '\n'
  return newline.repeat(k)
}

/** For future devs:
 * jsPDF is a library that allows us to generate PDFs on the client side.
 * doc.text(...) is used to add text to the PDF.
 * Instead of calulating the coordinates of where to place the text, we use kNewlines(k) to add k number of newlines.
 * As such, we need use "k" to keep track of the current line number of the text.
 *
 * This approach works, so we have chosen to keep it.
 * 
 * For Future devs pt2 (29/6/2024): 
 * please for the love of god make this code more flexible
 * right now it doesn't even manage page overflow automatically
 * and is terrible to expand upon
 * 
 * Also you see that "justification" to use a running tracker of newlines? yeah that breaks
 * as soon as you start to actually format the document so IF YOU HAVE THE TIME please nuke that
 * entire system.
 * 
 * Incase you're wondering why I'm not doing it myself, because the deadline is in 1 month
 * Do not repeat the mistakes of ghosts long past
 */
export function generate_pdf(
  reg,
  patients,
  cancer,
  phlebotomy,
  fit,
  wce,
  doctorSConsult,
  socialService,
  geriMmse,
  geriVision,
  geriAudiometry,
  dietitiansConsult,
  oralHealth,
  triage,
  vaccine,
  lung,
  nkf,
  hsg,
  grace,
  hearts,
  geriPtConsult,
  geriOtConsult,
  mental
) {
  var doc = new jsPDF()
  var k = 0
  doc.setFontSize(10)

  k = patient(doc, reg, patients, k)

  k = addBloodPressure(doc, triage, k)
  k = addBmi(doc, k, triage.triageQ10, triage.triageQ11)
  
  k = addOtherScreeningModularities(doc, lung, geriVision, k)
  k = testOverflow(doc, k, 10)
  
  k = addFollowUp(doc, k, reg, vaccine, hsg, phlebotomy, fit, wce, nkf, grace, hearts, oralHealth, mental)

  k = addMemos(doc, k, geriAudiometry, dietitiansConsult, geriPtConsult, geriOtConsult)

  // DEPRECATED
  // k = addPhlebotomy(doc, phlebotomy, k)
  // k = addFit(doc, fit, k)
  // k = addWce(doc, patients, wce, k)
  // k = addGeriatrics(doc, geriMmse, geriVision, geriAudiometry, k)
  // k = addDoctorSConsult(doc, doctorSConsult, k)
  // k = addDietitiansConsult(doc, dietitiansConsult, k)
  // k = addSocialService(doc, socialService, k)
  k = addRecommendation(doc, k)

  if (typeof patients.initials == 'undefined') {
    doc.save('Report.pdf')
  } else {
    var patient_name = patients.initials.split(' ')
    var i = 0
    var patient_name_seperated = patient_name[i]

    for (i = 1; i < patient_name.length; i++) {
      patient_name_seperated += '_' + patient_name[i]
    }

    patient_name_seperated += '_Report.pdf'
    doc.save(patient_name_seperated)
  }
}

export function patient(doc, reg, patients, k) {
  const salutation = typeof reg.registrationQ1 == 'undefined' ? parseFromLangKey("salutation") : reg.registrationQ1

  doc.addImage(logo, 'PNG', 10, 10, 77.8, 26.7)
  k = k + 3

  doc.setFont(undefined, 'bold')
  const original_font_size = doc.getFontSize()
  doc.setFontSize(17)
  doc.text(
    10,
    10,
    kNewlines((k = k + 2)) + parseFromLangKey("title"),
  )
  k = k + 4

  doc.setFontSize(original_font_size)
  doc.setFont(undefined, 'normal')
  // Thanks note
  var thanksNote = doc.splitTextToSize(
    kNewlines((k = k + 2)) +
      parseFromLangKey("dear") +
      salutation +
      ' ' +
      patients.initials +
      ',\n' +
      parseFromLangKey("intro"),
    180,
  )
  doc.text(10, 10, thanksNote)
  k = k + 2

  return k
}

export function addBmi(doc, k, height, weight) {
  //Bmi
  const bmi = calculateBMI(Number(height), Number(weight))

  doc.setFont(undefined, 'bold')
  doc.text(10, 10, kNewlines((k = k + 2)) + parseFromLangKey("bmi_title"))
  doc.line(10, calculateY(k), 10 + doc.getTextWidth(parseFromLangKey("bmi_title")), calculateY(k))
  doc.setFont(undefined, 'normal')

  doc.text(
    10,
    10,
    kNewlines((k = k + 1)) +
      parseFromLangKey("bmi_reading", height, weight, bmi.toString()),
  )

  k = k + 2

  doc.addImage(bmiQR, 'PNG', 165, 135, 32, 32)
  const original_font_size = doc.getFontSize()
  doc.setFontSize(8)
  doc.text(160, 170, doc.splitTextToSize(
    "https://www.healthhub.sg/live-healthy/weight_putting_me_at_risk_of_health_problems"
  , 40))
  doc.setFontSize(original_font_size)

  doc.autoTable({
    theme: 'plain',
    styles: {
      lineWidth: 0.1,
      lineColor: 0,
      cellWidth: 57
    },
    startY: calculateY(k),
    head: [[parseFromLangKey("bmi_tbl_l_header"), parseFromLangKey("bmi_tbl_r_header")]],
    body: [
      ['18.5 - 22.9', parseFromLangKey("bmi_tbl_low")],
      ['23.0 - 27.4', parseFromLangKey("bmi_tbl_mod")],
      ['27.5 - 32.4', parseFromLangKey("bmi_tbl_high")],
      ['32.5 - 37.4', parseFromLangKey("bmi_tbl_vhigh")]
    ]
  })
  k = k + 10

  // doc.setFont(undefined, 'bold')
  // doc.text(10, 10, kNewlines((k = k + 2)) + 'Asian BMI cut-off points for action')
  // doc.line(
  //   10,
  //   calculateY(k),
  //   10 + doc.getTextWidth('Asian BMI cut-off points for action'),
  //   calculateY(k),
  // )
  // doc.text(80, 10, kNewlines(k) + 'Cardiovascular disease risk')
  // doc.line(80, calculateY(k), 80 + doc.getTextWidth('Cardiovascular disease risk'), calculateY(k))
  // doc.setFont(undefined, 'normal')

  // doc.text(26, 10, kNewlines((k = k + 1)) + '18.5 - 22.9')
  // doc.text(96, 10, kNewlines(k) + 'Low')

  // doc.text(26, 10, kNewlines((k = k + 1)) + '23.0 - 27.4')
  // doc.text(96, 10, kNewlines(k) + 'Moderate')

  // doc.text(26, 10, kNewlines((k = k + 1)) + '27.5 - 32.4')
  // doc.text(96, 10, kNewlines(k) + 'High')

  // doc.text(26, 10, kNewlines((k = k + 1)) + '32.5 - 37.4')
  // doc.text(96, 10, kNewlines(k) + 'Very High')

  // if (bmi <= 22.9) {
  //   doc.text(
  //     10,
  //     10,
  //     kNewlines((k = k + 2)) +
  //       'According to the Asian BMI ranges, you have a low risk of heart disease.',
  //   )
  // } else if (bmi > 22.9 && bmi <= 27.4) {
  //   doc.text(
  //     10,
  //     10,
  //     kNewlines((k = k + 2)) +
  //       'According to the Asian BMI ranges, you have a low risk of heart disease.',
  //   )
  // } else if (bmi > 27.4 && bmi <= 32.4) {
  //   doc.text(
  //     10,
  //     10,
  //     kNewlines((k = k + 2)) +
  //       'According to the Asian BMI ranges, you have a high risk of heart disease.',
  //   )
  // } else {
  //   doc.text(
  //     10,
  //     10,
  //     kNewlines((k = k + 2)) +
  //       'According to the Asian BMI ranges, you have a very high risk of heart disease.',
  //   )
  // }

  return k
}

export function addBloodPressure(doc, triage, k) {
  doc.setFont(undefined, 'bold')
  doc.text(10, 10, kNewlines((k = k + 2)) + parseFromLangKey("bp_title"))
  doc.line(10, calculateY(k), 10 + doc.getTextWidth(parseFromLangKey("bp_title")), calculateY(k))
  doc.setFont(undefined, 'normal')
  doc.text(
    10,
    10,
    kNewlines((k = k + 1)) +
      parseFromLangKey("bp_reading") +
      triage.triageQ7 +
      '/' +
      triage.triageQ8 +
      ' mmHg.',
  )

  doc.addImage(bloodpressureQR, "png", 165, 75, 32, 32);
  const original_font_size = doc.getFontSize()
  doc.setFontSize(8)
  doc.text(160, 110, doc.splitTextToSize(
    "https://www.healthhub.sg/a-z/diseases-and-conditions/understanding-blood-pressure-readings"
  , 40))
  doc.setFontSize(original_font_size)

  var bloodPressure = doc.splitTextToSize(
    kNewlines((k = k + 2)) + parseFromLangKey("bp_tip"),
    145,
  )
  doc.text(10, 10, bloodPressure)
  
  k = k + 6

  return k
}

export function addOtherScreeningModularities(doc, lung, eye, k) {
  doc.setFont(undefined, 'bold')
  doc.text(10, 10, kNewlines((k = k + 2)) + parseFromLangKey("other_title"))
  doc.line(10, calculateY(k), 10 + doc.getTextWidth(parseFromLangKey("other_title")), calculateY(k))
  doc.setFont(undefined, 'normal')

  // TODO: LUNG
  doc.text(10, 10, kNewlines((k = k + 1)) + parseFromLangKey("other_lung"))
  k++
  doc.autoTable({
    theme: 'plain',
    styles: {
      overflow: 'visible',
      lineWidth: 0.1,
      lineColor: 0,
      cellWidth: 32
    },
    startY: calculateY(k),
    head: [[ 
      { content: parseFromLangKey("other_lung_tbl_l_header"),
        colSpan: 2,
        styles: {
          valign: "middle",
          fillColor: [244, 247, 249],
          fontStyle: "bold"
        }}
      , { content: parseFromLangKey("other_lung_tbl_r_header"),
        colSpan: 2,
        styles: {
          valign: "middle",
          fillColor: [244, 247, 249],
          fontStyle: "bold"
        }}
      ]],
    body: [
      ['FVC (L)', `${lung.LUNG3}`,'FVC (L)', `${lung.LUNG8}`],
      ['FEV1 (L)', `${lung.LUNG4}`,'FEV1 (L)', `${lung.LUNG9}`],
      ['FVC (%pred)', `${lung.LUNG5}`,'FVC (%pred)', `${lung.LUNG10}`],
      ['FEV1 (%pred)', `${lung.LUNG6}`,'FEV1 (%pred)', `${lung.LUNG11}`],
      ['FEV1/FVC (%)', `${lung.LUNG7}`,'FEV1/FVC (%)', `${lung.LUNG12}`],
    ]
  })
  k = k + 13
  
  // EYE
  doc.text(10, 10, kNewlines((k = k + 1)) + parseFromLangKey("other_eye"))
  k++
  doc.autoTable({
    theme: 'plain',
    styles: {
      lineWidth: 0.1,
      lineColor: 0,
      cellWidth: 46.6
    },
    startY: calculateY(k),
    head: [['', parseFromLangKey("other_eye_tbl_l_header"), parseFromLangKey("other_eye_tbl_r_header")]],
    body: [
      [parseFromLangKey("other_eye_tbl_t_row"), `6/${eye.geriVisionQ3}`, `6/${eye.geriVisionQ4}`],
      [parseFromLangKey("other_eye_tbl_b_row"), `6/${eye.geriVisionQ5}`, `6/${eye.geriVisionQ6}`]
    ]
  })
  k = k + 6

  doc.text(10, 10, kNewlines((k = k + 2)) + parseFromLangKey("other_eye_error") + `${eye.geriVisionQ8}`)

  return k
}

export function addFollowUp(doc, k, reg, vaccine, hsg, phlebotomy, fit, wce, nkf, grace, geriWhForm, oral, mental) {
  doc.setFont(undefined, 'bold')
  doc.text(10, 10, kNewlines((k = k + 2)) + parseFromLangKey("fw_title"))
  doc.line(10, calculateY(k), 10 + doc.getTextWidth(parseFromLangKey("fw_title")), calculateY(k))
  doc.setFont(undefined, 'normal')
  k++

  const clean_k = k

  const trip = (k) => followUpWith(doc, k, null, 0, k == clean_k, parseFromLangKey("fw_intro"))

  const indent = 10
  // VACCINE
  k = followUpWith(doc, k, trip, indent, vaccine.VAX1 == 'Yes', 
    parseFromLangKey("fw_vax", vaccine.VAX2))
    // 'You signed up for an influenza vaccine with [unsure yet] on [unsure].'
    // + 'Please contact [unsure] for further details.')
  // HSG
  k = followUpWith(doc, k, trip, indent, hsg.HSG1 == 'Yes, I signed up for HSG today', 
    parseFromLangKey("fw_hsg")
    // 'You signed up for HealthierSG today, please check with HealthierSG for your registered HealthierSG clinic.'
  )
  // PHLEBOTOMY
  k = followUpWith(doc, k, trip, indent, reg.registrationQ15 == 'Yes', 
    parseFromLangKey("fw_phlebotomy"))
  k = followUpWith(doc, k, trip, indent + 5, reg.registrationQ15 == 'Yes', 
      parseFromLangKey("fw_phlebotomy_1", reg.registrationQ18), 'm')
    // `You had your blood drawn and registered for follow up at our partner Phlebotomy Clinic. 
    // When your results are ready for collection, our PHS volunteers will call you to remind you.  
    // You have indicated your preferred clinic to be ${reg.registrationQ18}`)
  // FIT
  k = followUpWith(doc, k, trip, indent, fit.fitQ2 == 'Yes', 
    parseFromLangKey("fw_fit"))
    // 'You signed up for FIT home kits to be delivered to you, '
    // + 'please follow instructions from our partner Singapore Cancer Society.')
  // HPV
  k = followUpWith(doc, k, trip, indent, wce.wceQ5 == 'Yes', 
    parseFromLangKey("fw_wce"))
  k = followUpWith(doc, k, trip, indent + 5, wce.wceQ5 == 'Yes', 
    parseFromLangKey("fw_wce_1"), 'm')
    // `You have indicated interest with Singapore Cancer Society for HPV Test on ${wce.wceQ6} at Singapore Cancer Society Clinic@Bishan, with the address found below. 
    // - Address: 
    // 9 Bishan Place Junction 8 Office Tower
    // #06-05, Singapore 579837
    // - Clinic operating hours:
    // Mondays to Fridays, 9.00am to 6.00pm (last appointment at 5pm)
    // Saturdays, 9.00am to 4.00pm (last appointment at 3.15pm)
    // - Contact us: 6499 9133`)
  // OSTEO

  // NKF
  k = followUpWith(doc, k, trip, indent, nkf.NKF1 == 'Yes', 
    parseFromLangKey("fw_nkf", nkf.NKF2))
  k = followUpWith(doc, k, trip, indent + 5, nkf.NKF1 == 'Yes', 
    parseFromLangKey("fw_nkf_1"), 'm')

    // `You have indicated interest with National Kidney Foundation on ${nkf.NKF2} at CKD Clinic
    // - Address:
    // 109 Whampoa Road
    // #01-09/11, Singapore 321109
    // - Clinic operating hours:
    // Every wednesday (except public holidays), 9.00am to 11.15am, 2.15pm to 3.00pm
    // - Contact us: 1800-KIDNEYS / 1800-5436397`
  
  // MENTAL
  k = followUpWith(doc, k, trip, indent, mental.SAMH2 == 'Yes', 
    parseFromLangKey("fw_samh"))

  // GRACE
  k = followUpWith(doc, k, trip, indent, grace.GRACE2 == 'Yes', 
    parseFromLangKey("fw_grace", grace.GRACE3))
    // `You have been referred to a G-RACE associated partners/polyclinic, ${grace.GRACE3}. `
    // + `Please contact G-RACE at: g_race@nuhs.edu.sg`)
  // WHISPERING
  k = followUpWith(doc, k, trip, indent, geriWhForm.WH1 == 'Yes', 
    parseFromLangKey("fw_wh")
    // 'You have indicated interest to be followed-up with Whispering Hearts. Whispering Hearts '
    // + 'will contact you for follow up. Whispering Hearts can be contacted at: contact@viriya.org.sg'
  )
  // NUS DENTISTRY
  k = followUpWith(doc, k, trip, indent, oral.DENT4 == 'Yes',
    parseFromLangKey("fw_dent")
    // 'You have indicated interest with NUS Dentistry to be followed up. '
    // + 'Please contact NUS Dentistry at smileclinic@nus.edu.sg for further enquiries.'
  )

  k = followUpWith(doc, k, null, 0, k == clean_k,
    parseFromLangKey("fw_empty")
  )

  return k;
}

export function followUpWith(doc, k, trip, indent, condition, statement, symbol = 'l') {
  const width = 180
  if (condition) {
    if (trip) k = trip(k)
    var text = doc.splitTextToSize(
      statement,
      width,
    )
    k = testOverflow(doc, k, text.length)

    if (indent > 0) {
      doc.setFont("Zapfdingbats", 'normal')
      const old_size = doc.getFontSize()
      doc.text(10 + indent - 5, 10, kNewlines(k) + symbol)
      doc.setFont("helvetica", "normal")
    }

    doc.text(10 + indent, 10, 
      doc.splitTextToSize(
        kNewlines(k) + statement,
        width,
      )
    )

    k = k + text.length
  }
  return k;
}

export function addMemos(doc, k, audioData, dietData, ptData, otData) {
  k = testOverflow(doc, k, 24)

  doc.setFont(undefined, 'bold')
  doc.text(10, 10, kNewlines((k = k + 2)) + parseFromLangKey("memo_title"))
  doc.line(10, calculateY(k), 10 + doc.getTextWidth(parseFromLangKey("memo_title")), calculateY(k))
  doc.setFont(undefined, 'normal')

  const width = 180
  
  var audio = parseFromLangKey("memo_audio")
    + parseFromLangKey("memo_audio_1", audioData.geriAudiometryQ13)
    + parseFromLangKey("memo_audio_2", audioData.geriAudiometryQ12)
  var diet = parseFromLangKey("memo_diet")
    + `${dietData.dietitiansConsultQ4}`
  if (dietData.dietitiansConsultQ5) {
    diet += parseFromLangKey("memo_diet_1", dietData.dietitiansConsultQ5, dietData.dietitiansConsultQ6)
  }
  var pt = parseFromLangKey("memo_pt")
    + `${ptData.geriPtConsultQ1}`
  var ot = parseFromLangKey("memo_ot")
    + `${otData.geriOtConsultQ1}`

  doc.autoTable({
    theme: 'grid',
    styles: {
      cellWidth: 180,
      textColor: 20,
      lineColor: 20,
      fillColor: null
    },
    startY: calculateY(k = k + 1),
    head: [],
    body: [
      [audio],
      [diet],
      [pt],
      [ot]
    ],
    didDrawPage: function(data) {
      console.log(`Final cursor at ${data.cursor.y}`)
      k = Math.floor(data.cursor.y / 4.2)
    },
    willDrawCell: function(data) {  // copied from https://github.com/simonbengtsson/jsPDF-AutoTable/blob/master/src/models.ts
      if (data.section === 'body' && Array.isArray(data.cell.text)) {
        const PHYSICAL_LINE_HEIGHT = 1.15
        const k = doc.internal.scaleFactor
        const fontSize = doc.internal.getFontSize() / k

        var {x, y} = data.cell.getTextPos()
        y += fontSize * (2 - PHYSICAL_LINE_HEIGHT)
        doc.setFont(undefined, 'bold')
        doc.text(x, y, data.cell.text[0]);
        doc.setFont(undefined, 'normal')
        data.cell.text[0] = '\n'
      }
    }
  })
  k = k+1

  return k
}

const checkOverflow = (doc, k) => {
  if (k > 70) {
    doc.addPage()
    return 0
  }
  return k
}

const testOverflow = (doc, k, offset) => {
  if (k+offset > 70) {
    doc.addPage()
    return 0
  }
  return k
}

export function addRecommendation(doc, k) {
  k = testOverflow(doc, k, 10)
  let kk = k

  doc.setFont(undefined, 'bold')
  doc.text(10, 10, kNewlines((kk = kk + 2)) + parseFromLangKey("rec_title"))
  // doc.line(10, calculateY(kk), 10 + doc.getTextWidth('Recommendation'), calculateY(kk))
  doc.setFont(undefined, 'normal')

  var recommendation = doc.splitTextToSize(
    kNewlines((kk = kk + 2)) + parseFromLangKey("rec"),
    180
  )
  doc.text(10, 10, recommendation)
  kk = kk + 3

  kk = testOverflow(doc, kk, 13)

  doc.setFont(undefined, 'bold')
  doc.text(10, 10, kNewlines((kk = kk + 2)) + parseFromLangKey("disclaimer_title"))
  // doc.line(10, calculateY(kk), 10 + doc.getTextWidth('Recommendation'), calculateY(kk))
  doc.setFont(undefined, 'normal')
  doc.text(10, 10, doc.splitTextToSize(
    kNewlines((kk = kk + 2)) + parseFromLangKey("disclaimer"),
    180
  ))
}

export function calculateY(coor) {
  return coor * 4.0569 + 10.2
}

export const regexPasswordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/

export const deleteFromAllDatabase = async () => {
  const mongoConnection = mongoDB.currentUser.mongoClient('mongodb-atlas')
  const mongoDBConnection = mongoConnection.db('phs')

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
  console.log('done')
  // deletes volunteer accounts
  // console.log(await mongoDBConnection.collection("profiles").deleteMany({is_admin:{$eq : undefined}}))
}
