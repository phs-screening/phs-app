import mongoDB, { getName, isAdmin, getClinicSlotsCollection } from '../services/mongoDB'
import { blueText, redText, blueRedText } from 'src/theme/commonComponents.js'
import { jsPDF } from 'jspdf'

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
        if (await isAdmin()) {
          args.lastEdited = new Date()
          args.lastEditedBy = getName()
          await registrationForms.updateOne({ _id: patientId }, { $set: { ...args } })
          // replace form
          // registrationForms.findOneAndReplace({_id: record[formCollection]}, args);
          // throw error message
          // const errorMsg = "This form has already been submitted. If you need to make "
          //         + "any changes, please contact the admin."
          return { result: true }
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
  await clinicSlotsCollection.findOneAndUpdate(
    { postalCode },
    { $push: { counterItems: patientId } },
    { upsert: true },
  )

  const mongoConnection = mongoDB.currentUser.mongoClient('mongodb-atlas')
  const registrationFormRecords = mongoConnection.db('phs').collection('registrationForm')
  const patientRegForm = await registrationFormRecords.findOne({ _id: patientId })

  console.log(patientRegForm)
  try {
    if (patientRegForm && patientRegForm.registrationQ10) {
      const location = patientRegForm.registrationQ10.trim()
      const prevPostalCode = location === 'None' ? location : location.slice(-6)
      console.log(prevPostalCode)
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
export function calculateBMI(heightInCm, weightInKg) {
  const height = heightInCm / 100
  const bmi = (weightInKg / height / height).toFixed(1).toString()

  if (bmi >= 23.0) {
    return redText(bmi + '\nBMI is overweight')
  } else if (bmi <= 18.5) {
    return redText(bmi + '\nBMI is underweight')
  } else {
    return blueText(bmi)
  }
}

export function calculateBmi(heightInCm, weightInKg) {
  const height = heightInCm / 100
  const bmi = (weightInKg / height / height).toFixed(1)

  return bmi
}

// Formats the response for the geri vision section
export function formatGeriVision(acuity, questionNo) {
  const acuityInNumber = Number(acuity)
  var result
  var additionalInfo

  switch (questionNo) {
    case 3:
    case 4:
      if (acuityInNumber >= 6) {
        additionalInfo = '\nSee VA with pinhole'
        result = 'Visual acuity (w/o pinhole occluder) - Right Eye 6/' + acuity
        result = redText(result + additionalInfo)
      } else {
        result = 'Visual acuity (w/o pinhole occluder) - Left Eye 6/' + acuity
        result = blueText(result)
      }

      return result
    case 5:
    case 6:
      if (acuityInNumber >= 6) {
        result = 'Visual acuity (with pinhole occluder) - Right Eye 6/' + acuity
        additionalInfo = '\nNon-refractive error, participant should have consulted on-site doctor'
      } else {
        result = 'Visual acuity (with pinhole occluder) - Left Eye 6/' + acuity
        additionalInfo = '\nRefractive error, participant should have received spectacles vouchers'
      }
      result = redText(result + additionalInfo)

      return result
  }
}

export function formatWceStation(gender, question, answer) {
  if (gender == 'Male' || gender == 'Not Applicable') {
    return '-'
  }

  var result = answer
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

  result = blueRedText(result, additionalInfo)
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
) {
  var doc = new jsPDF()
  var k = 0
  doc.setFontSize(10)

  k = patient(doc, reg, patients, k)
  k = addBmi(doc, cancer, k)
  k = addBloodPressure(doc, cancer, k)
  k = addOtherScreeningModularities(doc, k)
  k = addPhleobotomy(doc, phlebotomy, k)
  k = addFit(doc, fit, k)
  k = addWce(doc, patients, wce, k)
  k = addDoctorSConsult(doc, doctorSConsult, k)
  k = addSocialService(doc, socialService, k)
  k = addGeriatrics(doc, geriMmse, geriVision, geriAudiometry, k)
  k = addDietitiansConsult(doc, dietitiansConsult, k)
  k = addOralHealth(doc, oralHealth, k)
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
  const salutation = typeof reg.registrationQ1 == 'undefined' ? 'Mr/Mrs' : reg.registrationQ1
  doc.setFont(undefined, 'bold')
  doc.text(
    10,
    10,
    kNewlines((k = k + 2)) + 'Public Health Service 2023 (PHS 2023) Health Screening Report',
  )
  doc.line(
    10,
    calculateY(k),
    10 + doc.getTextWidth('Public Health Service 2023 (PHS 2023) Health Screening Report'),
    calculateY(k),
  )

  doc.setFont(undefined, 'normal')
  // Thanks note
  var thanksNote = doc.splitTextToSize(
    kNewlines((k = k + 2)) +
      'Dear ' +
      salutation +
      ' ' +
      patients.initials +
      ',\n' +
      'Thank you for participating in our health screening at Jurong East on 20th/21st August this year.' +
      ' Here are your screening results:',
    180,
  )
  doc.text(10, 10, thanksNote)
  k = k + 2

  return k
}

export function addBmi(doc, cancer, k) {
  //Bmi
  const bmi = calculateBmi(Number(cancer.hxCancerQ19), Number(cancer.hxCancerQ20))

  doc.setFont(undefined, 'bold')
  doc.text(10, 10, kNewlines((k = k + 2)) + 'Body Mass Index (BMI)')
  doc.line(10, calculateY(k), 10 + doc.getTextWidth('Body Mass Index (BMI)'), calculateY(k))
  doc.setFont(undefined, 'normal')

  doc.text(
    10,
    10,
    kNewlines((k = k + 2)) +
      'Your height is ' +
      cancer.hxCancerQ19 +
      ' cm and your weight is ' +
      cancer.hxCancerQ20 +
      ' kg. Your BMI is ' +
      bmi.toString() +
      ' kg/m2.',
  )

  doc.setFont(undefined, 'bold')
  doc.text(10, 10, kNewlines((k = k + 2)) + 'Asian BMI cut-off points for action')
  doc.line(
    10,
    calculateY(k),
    10 + doc.getTextWidth('Asian BMI cut-off points for action'),
    calculateY(k),
  )
  doc.text(80, 10, kNewlines(k) + 'Cardiovascular disease risk')
  doc.line(80, calculateY(k), 80 + doc.getTextWidth('Cardiovascular disease risk'), calculateY(k))
  doc.setFont(undefined, 'normal')

  doc.text(26, 10, kNewlines((k = k + 1)) + '18.5 - 22.9')
  doc.text(96, 10, kNewlines(k) + 'Low')

  doc.text(26, 10, kNewlines((k = k + 1)) + '23.0 - 27.4')
  doc.text(96, 10, kNewlines(k) + 'Moderate')

  doc.text(26, 10, kNewlines((k = k + 1)) + '27.5 - 32.4')
  doc.text(96, 10, kNewlines(k) + 'High')

  doc.text(26, 10, kNewlines((k = k + 1)) + '32.5 - 37.4')
  doc.text(96, 10, kNewlines(k) + 'Very High')

  if (bmi <= 22.9) {
    doc.text(
      10,
      10,
      kNewlines((k = k + 2)) +
        'According to the Asian BMI ranges, you have a low risk of heart disease.',
    )
  } else if (bmi > 22.9 && bmi <= 27.4) {
    doc.text(
      10,
      10,
      kNewlines((k = k + 2)) +
        'According to the Asian BMI ranges, you have a low risk of heart disease.',
    )
  } else if (bmi > 27.4 && bmi <= 32.4) {
    doc.text(
      10,
      10,
      kNewlines((k = k + 2)) +
        'According to the Asian BMI ranges, you have a high risk of heart disease.',
    )
  } else {
    doc.text(
      10,
      10,
      kNewlines((k = k + 2)) +
        'According to the Asian BMI ranges, you have a very high risk of heart disease.',
    )
  }

  return k
}

export function addBloodPressure(doc, cancer, k) {
  doc.setFont(undefined, 'bold')
  doc.text(10, 10, kNewlines((k = k + 2)) + 'Blood Pressure')
  doc.line(10, calculateY(k), 10 + doc.getTextWidth('Blood Pressure'), calculateY(k))
  doc.setFont(undefined, 'normal')
  doc.text(
    10,
    10,
    kNewlines((k = k + 2)) +
      'Your average blood pressure reading is ' +
      cancer.hxCancerQ17 +
      '/' +
      cancer.hxCancerQ18 +
      ' mmHg.',
  )
  var bloodPressure = doc.splitTextToSize(
    kNewlines((k = k + 2)) +
      'A normal blood pressure reading is lower than 130/85mmHg.' +
      ' As blood pressure is characterised by large spontaneous variations,' +
      ' the diagnosis of high blood pressure should be based on multiple blood pressure measurements' +
      ' taken on several separate occasions. This should be regularly followed-up by a doctor who can provide' +
      ' the appropriate diagnosis and management. If your average blood pressure reading is above 130/85, please' +
      ' consult a doctor who can better evaluate your risk of hypertension.',
    180,
  )
  doc.text(10, 10, bloodPressure)
  k = k + 4

  return k
}

export function addOtherScreeningModularities(doc, k) {
  doc.setFont(undefined, 'bold')
  doc.text(10, 10, kNewlines((k = k + 2)) + 'Other Screening Modalities')
  doc.line(10, calculateY(k), 10 + doc.getTextWidth('Other Screening Modalities'), calculateY(k))
  doc.setFont(undefined, 'normal')

  return k
}

export function addPhleobotomy(doc, phlebotomy, k) {
  if (phlebotomy.phlebotomyQ1) {
    doc.setFont(undefined, 'bold')
    doc.text(10, 10, kNewlines((k = k + 2)) + 'Phlebotomy')
    doc.line(10, calculateY(k), 10 + doc.getTextWidth('Phlebotomy'), calculateY(k))
    doc.setFont(undefined, 'normal')

    let phlebotomy = doc.splitTextToSize(
      kNewlines((k = k + 2)) +
        'The Blood Test Report will be mailed out to GP clinics' +
        ' you have previously indicated. You will receive a call/SMS to' +
        ' inform you about the GP appointment.',
      180,
    )
    k++
    doc.text(10, 10, phlebotomy)
  }

  return k
}

export function addFit(doc, fit, k) {
  let kk = k

  if (fit.fitQ2 == 'Yes') {
    doc.setFont(undefined, 'bold')
    doc.text(10, 10, kNewlines((kk = kk + 2)) + 'Faecal Immunochemical Test (FIT)')
    doc.line(
      10,
      calculateY(kk),
      10 + doc.getTextWidth('Faecal Immunochemical Test (FIT)'),
      calculateY(kk),
    )
    doc.setFont(undefined, 'normal')
    let fit = doc.splitTextToSize(
      kNewlines((kk = kk + 2)) +
        'Please remember the instructions that have been given to you, and remember to mail out' +
        ' both of your kits within the stipulated time. You may contact the SIngapore Cancer Society' +
        ' at 1800-727-3333 if you have any queries about using the FIT kit.',
      180,
    )
    kk = kk + 2
    doc.text(10, 10, fit)
  }

  return kk
}

export function addWce(doc, patients, wce, k) {
  let kk = k

  if ((wce.wceQ4 != 'Yes' && wce.wceQ5 != 'Yes') || patients.gender == 'Male') {
    return kk
  }

  doc.setFont(undefined, 'bold')
  doc.text(10, 10, kNewlines((kk = kk + 2)) + "Women's Cancer Education")
  doc.line(10, calculateY(kk), 10 + doc.getTextWidth("Women's Cancer Education"), calculateY(kk))
  doc.setFont(undefined, 'normal')

  doc.setFont(undefined, 'bold')
  doc.text(
    10,
    10,
    kNewlines((kk = kk + 2)) + 'You have indicated interest for the following screening(s):',
  )
  doc.line(
    10,
    calculateY(kk),
    10 + doc.getTextWidth('You have indicated interest for the following screening(s):'),
    calculateY(kk),
  )
  doc.setFont(undefined, 'normal')

  if (wce.wceQ4 == 'Yes') {
    doc.text(
      10,
      10,
      kNewlines((kk = kk + 1)) + '- Cervical Cancer Screening under Singapore Cancer Society',
    )
  }

  if (wce.wceQ5 == 'Yes') {
    doc.text(
      10,
      10,
      kNewlines((kk = kk + 1)) + '- Mammogram screening under Singapore Cancer Society',
    )
  }

  var summary = doc.splitTextToSize(
    kNewlines((kk = kk + 2)) +
      'Do note that the Singapore Cancer Society (SCS) will contact you regarding your appointment. Should you have any' +
      ' queries, please contact the Singapore Cancer' +
      ' Society at 1800-727-3333.',
    180,
  )
  kk = kk + 2

  if (wce.wceQ4 == 'Yes' || wce.wceQ5 == 'Yes') {
    doc.text(10, 10, summary)
  }

  return kk
}

export function addDoctorSConsult(doc, doctorSConsult, k) {
  let kk = k

  if (
    typeof doctorSConsult.doctorSConsultQ3 == 'string' ||
    doctorSConsult.doctorSConsultQ3 instanceof String
  ) {
    doc.setFont(undefined, 'bold')
    doc.text(10, 10, kNewlines((kk = kk + 2)) + "Doctor's Consultation")
    doc.line(10, calculateY(kk), 10 + doc.getTextWidth("Doctor's Consultation"), calculateY(kk))
    doc.setFont(undefined, 'normal')

    var dSC = doc.splitTextToSize(
      kNewlines((kk = kk + 2)) +
        'We strongly encourage you to visit your family doctor with the Doctor’s Memo obtained' +
        ' from our screening. He/She will be able to advise you on your next steps with regards' +
        ' to the health issue(s) raised in the memo.',
      180,
    )
    doc.text(10, 10, dSC)
    kk = kk + 1
  }

  return kk
}

export function addSocialService(doc, socialService, k) {
  let kk = k

  if (typeof socialService.socialServiceQ1 == 'undefined') {
    return kk
  }

  doc.setFont(undefined, 'bold')
  doc.text(10, 10, kNewlines((kk = kk + 2)) + 'Social Service')
  doc.line(10, calculateY(kk), 10 + doc.getTextWidth('Social Service'), calculateY(kk))
  doc.setFont(undefined, 'normal')

  if (socialService.socialServiceQ1 == 'Yes') {
    var socialServiceQ1 = doc.splitTextToSize(
      kNewlines((kk = kk + 2)) +
        'We strongly encourage you to follow through with the recommendations from Agency of Integrated Care (AIC)' +
        ' so that you receive the help that you need.',
      180,
    )
    doc.text(10, 10, socialServiceQ1)
    kk++
  }

  doc.setFont(undefined, 'bold')
  doc.text(10, 10, kNewlines((kk = kk + 2)) + 'SACS')
  doc.setFont(undefined, 'normal')
  if (socialService.socialServiceQ6) {
    var socialServiceQ6 = doc.splitTextToSize(
      kNewlines((kk = kk + 1)) +
        'Do note that the Singapore Anglican Community Service (SACS) will contact you regarding your' +
        ' application status for their programmes.',
      180,
    )
    doc.text(10, 10, socialServiceQ6)
    kk++
  }

  doc.addPage()
  kk = 0
  kk++
  doc.setFont(undefined, 'bold')
  doc.text(10, 10, kNewlines((kk = kk + 2)) + 'HDB EASE')
  doc.setFont(undefined, 'normal')
  if (socialService.socialServiceQ7) {
    var socialServiceQ7 = doc.splitTextToSize(
      kNewlines((kk = kk + 1)) +
        'The HDB Branch managing your estate will reply to you within 7 working days regarding your application.' +
        ' HDB staff and/ or HDB appointed term contractor will contact you to arrange for a pre-condition survey/ installation date.' +
        ' You may expect the process from applying for EASE (Direct Application) to having the improvement items installed in your flat to' +
        ' be completed within a month.',
      180,
    )
    doc.text(10, 10, socialServiceQ7)
    kk = kk + 3
  }

  doc.setFont(undefined, 'bold')
  doc.text(10, 10, kNewlines((kk = kk + 2)) + 'CHAS Application')
  doc.setFont(undefined, 'normal')
  if (socialService.socialServiceQ8) {
    var socialServiceQ8 = doc.splitTextToSize(
      kNewlines((kk = kk + 1)) +
        'Application takes 15 working days from the date of receipt of the completed application to process. Successful applicants and their' +
        ' household members will receive a CHAS card that indicates the subsidy tier they are eligible for, as well as a welcome pack with information' +
        ' on the use of the card. If you have not received the outcome after 15 working days, you can visit the CHAS online application page and login using' +
        ' your SingPass. You can also call the CHAS hotline at 1800-275-2427 (1800-ASK-CHAS) to check on your application status or if you need assistance in applying' +
        ' for CHAS.',
      180,
    )
    doc.text(10, 10, socialServiceQ8)
    kk = kk + 5
  }

  return kk
}

export function calculateY(coor) {
  return coor * 4.0569 + 10.2
}

export function addGeriatrics(doc, geriMmse, geriVision, geriAudiometry, k) {
  let kk = k
  const polyclinic = typeof geriMmse.geriMMSEQ4 != 'undefined' ? geriMmse.geriMMSEQ4 : '-'

  doc.setFont(undefined, 'bold')
  doc.text(10, 10, kNewlines((kk = kk + 2)) + 'Geriatrics')
  doc.line(10, calculateY(kk), 10 + doc.getTextWidth('Geriatrics'), calculateY(kk))
  doc.setFont(undefined, 'normal')

  doc.setFont(undefined, 'bold')
  doc.text(
    10,
    10,
    kNewlines((kk = kk + 2)) + 'Please follow through with your appointment(s) with:',
  )
  doc.line(
    10,
    calculateY(kk),
    10 + doc.getTextWidth('Please follow through with your appointment(s) with:'),
    calculateY(kk),
  )
  doc.setFont(undefined, 'normal')

  if (geriMmse.geriMMSEQ3 == 'Yes') {
    doc.text(
      10,
      10,
      kNewlines((kk = kk + 1)) + '- G-RACE and partnering polyclinics (' + polyclinic + ')',
    )
  }

  doc.setFont(undefined, 'bold')
  doc.text(10, 10, kNewlines((kk = kk + 2)) + 'SWCDC Eye Vouchers')
  doc.setFont(undefined, 'normal')
  var vouchers = doc.splitTextToSize(
    kNewlines((kk = kk + 1)) +
      'We strongly encourage you to use the eye vouchers before they expire.',
  )
  doc.text(10, 10, vouchers)

  doc.setFont(undefined, 'bold')
  doc.text(10, 10, kNewlines((kk = kk + 2)) + 'Physiotherapy')
  doc.setFont(undefined, 'normal')
  var geriatrics = doc.splitTextToSize(
    kNewlines((kk = kk + 1)) +
      'We strongly encourage you to follow through with the' +
      ' recommendations from Physiotherapy lead a more active' +
      ' and healthier lifestyle.',
    180,
  )
  doc.text(10, 10, geriatrics)

  doc.setFont(undefined, 'bold')
  doc.text(10, 10, kNewlines((kk = kk + 3)) + 'Occupational Therapy')
  doc.setFont(undefined, 'normal')
  var otherGeriatrics = doc.splitTextToSize(
    kNewlines((kk = kk + 1)) +
      'We advice that you increase your lighting, declutter commonly used spaces to' +
      ' prevent falls. As recommended by the Occupational Therapists as of any other arrangements' +
      ' mentioned during the interview.',
    180,
  )
  doc.text(10, 10, otherGeriatrics)

  kk++
  return kk
}

export function addDietitiansConsult(doc, dietitiansConsult, k) {
  let kk = k
  // const notes = dietitiansConsult.dietitiansConsultQ4

  if (dietitiansConsult.dietitiansConsultQ7 == 'Yes') {
    doc.setFont(undefined, 'bold')
    doc.text(10, 10, kNewlines((kk = kk + 2)) + "Dietitian's Consult")
    doc.line(10, calculateY(kk), 10 + doc.getTextWidth("Dietitian's Consult"), calculateY(kk))
    doc.setFont(undefined, 'normal')

    let dietitiansConsult = doc.splitTextToSize(
      kNewlines((kk = kk + 2)) +
        'We strongly encourage you to follow through with the recommendations from the' +
        ' Dietitian to lead a more healthy lifestyle. Make changes to your diet and lifestyle for' +
        ' a healthier you!',
      180,
    )
    doc.text(10, 10, dietitiansConsult)
    kk++
  }

  return kk
}

export function addOralHealth(doc, oralHealth, k) {
  let kk = k
  if (oralHealth.oralHealthQ2) {
    doc.setFont(undefined, 'bold')
    doc.text(10, 10, kNewlines((kk = kk + 2)) + 'Oral Health Consult')
    doc.line(10, calculateY(kk), 10 + doc.getTextWidth('Oral Health Consult'), calculateY(kk))
    doc.setFont(undefined, 'normal')

    doc.text(
      10,
      10,
      kNewlines((kk = kk + 2)) +
        'We strongly encourage you to follow through with the recommendations from NUS Dentistry for adequate oral care.',
    )
  }

  return kk
}

export function addRecommendation(doc, k) {
  let kk = k

  doc.setFont(undefined, 'bold')
  doc.text(10, 10, kNewlines((kk = kk + 2)) + 'Recommendation')
  doc.line(10, calculateY(kk), 10 + doc.getTextWidth('Recommendation'), calculateY(kk))
  doc.setFont(undefined, 'normal')

  var recommendation = doc.splitTextToSize(
    kNewlines((kk = kk + 2)) +
      'You are strongly recommended to seek follow-up based on your health screening result.' +
      ' If you have not opted out of our Telehealth Initiative, we will be calling you soon as a' +
      ' form of follow-up in a few weeks time. Should you have any queries, feel free to contact us at medsocphs@gmail.com. We' +
      ' hope that you have benefited from PHS 2023 and would continue to support us' +
      ' in the future.',
    180,
  )
  doc.text(10, 10, recommendation)
}

export const regexPasswordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/

export const deleteFromAllDatabase = async () => {
  console.log('here')
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
