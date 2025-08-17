import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import mongoDB, { getName, isAdmin } from '../services/mongoDB';

import { bloodpressureQR, bmiQR, tempQR } from 'src/icons/QRCodes';
import updatedLogo from 'src/icons/UpdatedIcon';

//import 'jspdf-autotable'
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { updateAllStationCounts } from '../services/stationCounts';
import { parseFromLangKey, setLang, setLangUpdated } from './langutil';

import { addToFormAQueue, getSavedData, getSavedPatientData } from '../services/mongoDB';


import { generateStatusObject } from 'src/components/dashboard/PatientTimeline';
import allForms from '../forms/forms.json';
import { checkedBox, uncheckedBox } from '../icons/checked';
import pic1 from '../icons/pic1-forma';
import pic2 from '../icons/pic2-forma';
import { getEligibilityRows } from '../services/stationCounts';


pdfMake.vfs = pdfFonts.vfs

pdfMake.fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Regular.ttf',
    italics: 'Roboto-Regular.ttf',
    bolditalics: 'Roboto-Regular.ttf'
  },
  fangzhen: {
    normal: 'fzhei-jt.ttf',
    bold: 'fzhei-jt.ttf',
    italics: 'fzhei-jt.ttf',
    bolditalics: 'fzhei-jt.ttf'
  }
};

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

    console.log('patient id: ' + record2)

    if (record2 == null) {
      qNum = await mongoDB.currentUser.functions.getNextQueueNo()
      await patientsRecord.insertOne({ queueNo: qNum, ...data })
      patientId = qNum
    }

    const record = await patientsRecord.findOne({ queueNo: patientId })

    if (record) {
      // Adds a key-value pair for each form submitted for the first time to the patient's document in the patients collection
      // in MongoDB to track which forms have been successfully submitted
      if (record[formCollection] === undefined) {
        await patientsRecord.updateOne(
          { queueNo: patientId },
          { $set: { [formCollection]: patientId } },
        )

        await registrationForms.insertOne({ _id: patientId, ...args })

        await updateAllStationCounts(patientId)

        await updateGeriGraceEligibility(args, patientId, formCollection)

        return { result: true, data: data, qNum: patientId }
      } else {
        if (await isAdmin()) {
          args.lastEdited = new Date()
          args.lastEditedBy = getName()
          await registrationForms.updateOne({ _id: patientId }, { $set: { ...args } })
          if (formCollection == 'registrationForm') {
            await patientsRecord.updateOne(
              { queueNo: patientId },
              { $set: { initials: args.registrationQ2 } },
            )
            await patientsRecord.updateOne(
              { queueNo: patientId },
              { $set: { age: args.registrationQ4 } },
            )
          }
          await updateAllStationCounts(patientId)
          await updateGeriGraceEligibility(args, patientId, formCollection, patientsRecord)
          // replace form
          // registrationForms.findOneAndReplace({_id: record[formCollection]}, args);
          // throw error message
          // const errorMsg = "This form has already been submitted. If you need to make "
          //         + "any changes, please contact the admin."
          return { result: true, data: data, qNum: patientId }
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
      console.log('There is an error here')
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
        await updateAllStationCounts(patientId)
        return { result: true }
      } else {
        args.lastEdited = new Date()
        args.lastEditedBy = getName()
        await registrationForms.updateOne({ _id: patientId }, { $set: { ...args } })
        await updateAllStationCounts(patientId)

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
  mental,
  social,
) {
  var doc = new jsPDF()
  var k = 0
  doc.setFontSize(10)
  setLang(doc, reg.registrationQ14)

  k = patient(doc, reg, patients, k)

  k = addBloodPressure(doc, triage, k)
  k = addBmi(doc, k, triage.triageQ10, triage.triageQ11)

  k = addOtherScreeningModularities(doc, lung, geriVision, social, k)
  k = testOverflow(doc, k, 10)

  k = addFollowUp(
    doc,
    k,
    reg,
    vaccine,
    hsg,
    phlebotomy,
    fit,
    wce,
    nkf,
    grace,
    hearts,
    oralHealth,
    mental,
  )

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
  const salutation =
    typeof reg.registrationQ1 == 'undefined' ? parseFromLangKey('salutation') : reg.registrationQ1

  doc.addImage(updatedLogo, 'PNG', 10, 10, 77.8, 26.7)
  k = k + 3

  doc.setFont(undefined, 'bold')
  const original_font_size = doc.getFontSize()
  doc.setFontSize(17)
  var title = doc.splitTextToSize(kNewlines((k = k + 2)) + parseFromLangKey('title'), 190)
  doc.text(10, 10, title)
  k = title.length + 3

  doc.setFontSize(original_font_size)
  doc.setFont(undefined, 'normal')
  // Thanks note
  var thanksNote = doc.splitTextToSize(
    kNewlines((k = k + 2)) +
    parseFromLangKey('dear', salutation, patients.initials) +
    '\n' +
    parseFromLangKey('intro'),
    190,
  )
  doc.text(10, 10, thanksNote)
  k = k + 2

  return k
}

export function addBmi(doc, k, height, weight) {
  //Bmi
  const bmi = calculateBMI(Number(height), Number(weight))

  doc.setFont(undefined, 'bold')
  doc.text(10, 10, kNewlines((k = k + 2)) + parseFromLangKey('bmi_title'))
  doc.line(10, calculateY(k), 10 + doc.getTextWidth(parseFromLangKey('bmi_title')), calculateY(k))
  doc.setFont(undefined, 'normal')

  doc.text(
    10,
    10,
    kNewlines((k = k + 1)) + parseFromLangKey('bmi_reading', height, weight, bmi.toString()),
  )

  k++

  doc.addImage(bmiQR, 'PNG', 165, 135, 32, 32)
  const original_font_size = doc.getFontSize()
  doc.setFontSize(8)
  doc.text(
    160,
    170,
    doc.splitTextToSize(
      'https://www.healthhub.sg/live-healthy/weight_putting_me_at_risk_of_health_problems',
      40,
    ),
  )
  doc.setFontSize(original_font_size)

  autoTable(doc, {
    theme: 'plain',
    styles: {
      font: doc.getFont().fontName,
      lineWidth: 0.1,
      lineColor: 0,
      cellWidth: 57,
    },
    startY: calculateY(k),
    head: [[parseFromLangKey('bmi_tbl_l_header'), parseFromLangKey('bmi_tbl_r_header')]],
    body: [
      ['18.5 - 22.9', parseFromLangKey('bmi_tbl_low')],
      ['23.0 - 27.4', parseFromLangKey('bmi_tbl_mod')],
      ['27.5 - 32.4', parseFromLangKey('bmi_tbl_high')],
      ['32.5 - 37.4', parseFromLangKey('bmi_tbl_vhigh')],
    ],
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
  doc.text(10, 10, kNewlines((k = k + 2)) + parseFromLangKey('bp_title'))
  doc.line(10, calculateY(k), 10 + doc.getTextWidth(parseFromLangKey('bp_title')), calculateY(k))
  doc.setFont(undefined, 'normal')
  doc.text(
    10,
    10,
    kNewlines((k = k + 1)) +
    parseFromLangKey('bp_reading') +
    triage.triageQ7 +
    '/' +
    triage.triageQ8 +
    ' mmHg.',
  )

  doc.addImage(bloodpressureQR, 'png', 165, 75, 32, 32)
  const original_font_size = doc.getFontSize()
  doc.setFontSize(8)
  doc.text(
    160,
    110,
    doc.splitTextToSize(
      'https://www.healthhub.sg/a-z/diseases-and-conditions/understanding-blood-pressure-readings',
      40,
    ),
  )
  doc.setFontSize(original_font_size)

  var bloodPressure = doc.splitTextToSize(kNewlines((k = k + 2)) + parseFromLangKey('bp_tip'), 150)
  doc.text(10, 10, bloodPressure)
  k = bloodPressure.length - 1

  return k
}

export function addOtherScreeningModularities(doc, lung, eye, social, k) {
  doc.setFont(undefined, 'bold')
  doc.text(10, 10, kNewlines((k = k + 2)) + parseFromLangKey('other_title'))
  doc.line(10, calculateY(k), 10 + doc.getTextWidth(parseFromLangKey('other_title')), calculateY(k))
  doc.setFont(undefined, 'normal')

  doc.text(10, 10, kNewlines((k = k + 1)) + parseFromLangKey('other_lung'))
  k++
  autoTable(doc, {
    theme: 'plain',
    styles: {
      font: doc.getFont().fontName,
      overflow: 'visible',
      lineWidth: 0.1,
      lineColor: 0,
      cellWidth: 32,
    },
    startY: calculateY(k),

    head: [
      [
        {
          content: parseFromLangKey('other_lung_tbl_l_header'),
          colSpan: 2,
          styles: {
            valign: 'middle',
            fillColor: [244, 247, 249],
            fontStyle: 'bold',
          },
        },
      ],
    ],

    body: [
      ['FVC (L)', `${lung.LUNG3}`],
      ['FEV1 (L)', `${lung.LUNG4}`],
      ['FVC (%pred)', `${lung.LUNG5}`],
      ['FEV1 (%pred)', `${lung.LUNG6}`],
      ['FEV1/FVC (%)', `${lung.LUNG7}`],
    ],
  })
  k = k + 11

  if (social.SOCIAL10) {
    doc.text(10, 10, kNewlines((k = k + 2)) + parseFromLangKey('other_lung_smoking'))
  }
  k += 2

  k = testOverflow(doc, k, 13)

  // EYE
  doc.text(10, 10, kNewlines((k = k + 1)) + parseFromLangKey('other_eye'))
  k++
  autoTable(doc, {
    theme: 'plain',
    styles: {
      font: doc.getFont().fontName,
      lineWidth: 0.1,
      lineColor: 0,
      cellWidth: 46.6,
    },
    startY: calculateY(k),
    head: [
      ['', parseFromLangKey('other_eye_tbl_l_header'), parseFromLangKey('other_eye_tbl_r_header')],
    ],
    body: [
      [parseFromLangKey('other_eye_tbl_t_row'), `6/${eye.geriVisionQ3}`, `6/${eye.geriVisionQ4}`],
      [parseFromLangKey('other_eye_tbl_b_row'), `6/${eye.geriVisionQ5}`, `6/${eye.geriVisionQ6}`],
    ],
  })
  k = k + 7

  doc.text(
    10,
    10,
    kNewlines((k = k + 2)) + parseFromLangKey('other_eye_error') + `${eye.geriVisionQ8}`,
  )

  return k
}

export function addFollowUp(
  doc,
  k,
  reg,
  vaccine,
  hsg,
  phlebotomy,
  fit,
  wce,
  nkf,
  grace,
  geriWhForm,
  oral,
  mental,
) {
  doc.setFont(undefined, 'bold')
  doc.text(10, 10, kNewlines((k = k + 2)) + parseFromLangKey('fw_title'))
  doc.line(10, calculateY(k), 10 + doc.getTextWidth(parseFromLangKey('fw_title')), calculateY(k))
  doc.setFont(undefined, 'normal')
  k++

  const indent = 10
  // VACCINE

  k = followUpWith(
    doc,
    k,
    trip,
    indent,
    vaccine.VAX1 == 'Yes',
    parseFromLangKey('fw_vax', vaccine.VAX2),
  )
  // 'You signed up for an influenza vaccine with [unsure yet] on [unsure].'
  // + 'Please contact [unsure] for further details.')
  // HSG
  k = followUpWith(
    doc,
    k,
    trip,
    indent,
    hsg.HSG1 == 'Yes, I signed up for HSG today',
    parseFromLangKey('fw_hsg'),
    // 'You signed up for HealthierSG today, please check with HealthierSG for your registered HealthierSG clinic.'
  )
  // PHLEBOTOMY
  k = followUpWith(
    doc,
    k,
    trip,
    indent,
    reg.registrationQ15 == 'Yes',
    parseFromLangKey('fw_phlebotomy'),
  )
  k = followUpWith(
    doc,
    k,
    trip,
    indent + 5,
    reg.registrationQ15 == 'Yes',
    parseFromLangKey('fw_phlebotomy_1', reg.registrationQ18),
    'm',
  )
  // `You had your blood drawn and registered for follow up at our partner Phlebotomy Clinic.
  // When your results are ready for collection, our PHS volunteers will call you to remind you.
  // You have indicated your preferred clinic to be ${reg.registrationQ18}`)
  // FIT
  k = followUpWith(doc, k, trip, indent, fit.fitQ2 == 'Yes', parseFromLangKey('fw_fit'))
  // 'You signed up for FIT home kits to be delivered to you, '
  // + 'please follow instructions from our partner Singapore Cancer Society.')
  // HPV
  k = followUpWith(doc, k, trip, indent, wce.wceQ5 == 'Yes', parseFromLangKey('fw_wce'))
  k = followUpWith(doc, k, trip, indent + 5, wce.wceQ5 == 'Yes', parseFromLangKey('fw_wce_1'), 'm')
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
  k = followUpWith(doc, k, trip, indent, nkf.NKF1 == 'Yes', parseFromLangKey('fw_nkf', nkf.NKF2))
  k = followUpWith(doc, k, trip, indent + 5, nkf.NKF1 == 'Yes', parseFromLangKey('fw_nkf_1'), 'm')

  // `You have indicated interest with National Kidney Foundation on ${nkf.NKF2} at CKD Clinic
  // - Address:
  // 109 Whampoa Road
  // #01-09/11, Singapore 321109
  // - Clinic operating hours:
  // Every wednesday (except public holidays), 9.00am to 11.15am, 2.15pm to 3.00pm
  // - Contact us: 1800-KIDNEYS / 1800-5436397`

  // MENTAL
  k = followUpWith(doc, k, trip, indent, mental.SAMH2 == 'Yes', parseFromLangKey('fw_samh'))

  // GRACE
  k = followUpWith(
    doc,
    k,
    trip,
    indent,
    grace.GRACE2 == 'Yes',
    parseFromLangKey('fw_grace', grace.GRACE3),
  )
  // `You have been referred to a G-RACE associated partners/polyclinic, ${grace.GRACE3}. `
  // + `Please contact G-RACE at: g_race@nuhs.edu.sg`)
  // WHISPERING
  k = followUpWith(
    doc,
    k,
    trip,
    indent,
    geriWhForm.WH1 == 'Yes',
    parseFromLangKey('fw_wh'),

    // 'You have indicated interest to be followed-up with Whispering Hearts. Whispering Hearts '
    // + 'will contact you for follow up. Whispering Hearts can be contacted at: contact@viriya.org.sg'
  )
  // NUS DENTISTRY
  k = followUpWith(
    doc,
    k,
    trip,
    indent,
    oral.DENT4 == 'Yes',
    parseFromLangKey('fw_dent'),
    // 'You have indicated interest with NUS Dentistry to be followed up. '
    // + 'Please contact NUS Dentistry at smileclinic@nus.edu.sg for further enquiries.'
  )

  k = followUpWith(doc, k, null, 0, k == clean_k, parseFromLangKey('fw_empty'))

  return k
}

export function followUpWith(doc, k, trip, indent, condition, statement, symbol = 'l') {
  const width = 180
  if (condition) {
    if (trip) k = trip(k)
    var text = doc.splitTextToSize(statement, width)
    k = testOverflow(doc, k, text.length)

    if (indent > 0) {
      const old_font = doc.getFont()
      doc.setFont('Zapfdingbats', 'normal')
      doc.text(10 + indent - 5, 10, kNewlines(k) + symbol)
      doc.setFont(old_font.fontName, 'normal')
    }

    doc.text(10 + indent, 10, doc.splitTextToSize(kNewlines(k) + statement, width))

    k = k + text.length + 1
  }
  return k
}

export function addMemos(doc, k, audioData, dietData, ptData, otData) {
  k = testOverflow(doc, k, 24)

  doc.setFont(undefined, 'bold')
  doc.text(10, 10, kNewlines((k = k + 2)) + parseFromLangKey('memo_title'))
  doc.line(10, calculateY(k), 10 + doc.getTextWidth(parseFromLangKey('memo_title')), calculateY(k))
  doc.setFont(undefined, 'normal')

  var audio =
    parseFromLangKey('memo_audio') +
    parseFromLangKey('memo_audio_1', audioData.geriAudiometryQ13) +
    parseFromLangKey('memo_audio_2', audioData.geriAudiometryQ12)
  var diet = parseFromLangKey('memo_diet') + `${dietData.dietitiansConsultQ4}`
  if (dietData.dietitiansConsultQ5) {
    diet += parseFromLangKey(
      'memo_diet_1',
      dietData.dietitiansConsultQ5,
      dietData.dietitiansConsultQ6,
    )
  }
  var pt = parseFromLangKey('memo_pt') + `${ptData.geriPtConsultQ1}`
  var ot = parseFromLangKey('memo_ot') + `${otData.geriOtConsultQ1}`

  var audio =
    parseFromLangKey('memo_audio') +
    parseFromLangKey('memo_audio_1', audioData.geriAudiometryQ13) +
    parseFromLangKey('memo_audio_2', audioData.geriAudiometryQ12)
  var diet = parseFromLangKey('memo_diet') + `${dietData.dietitiansConsultQ4}`
  if (dietData.dietitiansConsultQ5) {
    diet += parseFromLangKey(
      'memo_diet_1',
      dietData.dietitiansConsultQ5,
      dietData.dietitiansConsultQ6,
    )
  }
  var pt = parseFromLangKey('memo_pt') + `${ptData.geriPtConsultQ1}`
  var ot = parseFromLangKey('memo_ot') + `${otData.geriOtConsultQ1}`

  autoTable(doc, {
    theme: 'grid',
    styles: {
      font: doc.getFont().fontName,
      cellWidth: 180,
      textColor: 20,
      lineColor: 20,
      fillColor: null,
    },
    startY: calculateY((k = k + 1)),
    head: [],
    body: [[audio], [diet], [pt], [ot]],
    didDrawPage: function (data) {
      console.log(`Final cursor at ${data.cursor.y}`)
      k = Math.floor(data.cursor.y / 4.2)
    },
    willDrawCell: function (data) {
      // copied from https://github.com/simonbengtsson/jsPDF-AutoTable/blob/master/src/models.ts
      if (data.section === 'body' && Array.isArray(data.cell.text)) {
        const PHYSICAL_LINE_HEIGHT = 1.15
        const k = doc.internal.scaleFactor
        const fontSize = doc.internal.getFontSize() / k

        var { x, y } = data.cell.getTextPos()
        y += fontSize * (2 - PHYSICAL_LINE_HEIGHT)
        doc.setFont(undefined, 'bold')
        doc.text(x, y, data.cell.text[0])
        doc.setFont(undefined, 'normal')
        data.cell.text[0] = '\n'
      }
    },
  })
  k = k + 1

  return k
}

const testOverflow = (doc, k, offset) => {
  if (k + offset > 70) {
    doc.addPage()
    return 0
  }
  return k
}

export function addRecommendation(doc, k) {
  k = testOverflow(doc, k, 10)
  let kk = k

  doc.setFont(undefined, 'bold')
  doc.text(10, 10, kNewlines((kk = kk + 2)) + parseFromLangKey('rec_title'))
  // doc.line(10, calculateY(kk), 10 + doc.getTextWidth('Recommendation'), calculateY(kk))
  doc.setFont(undefined, 'normal')

  var recommendation = doc.splitTextToSize(kNewlines((kk = kk + 2)) + parseFromLangKey('rec'), 180)
  doc.text(10, 10, recommendation)
  kk = kk + doc.splitTextToSize(parseFromLangKey('rec'), 180).length

  var disclaimer = doc.splitTextToSize(parseFromLangKey('disclaimer'), 180)
  kk = testOverflow(doc, kk, disclaimer.length + 3)

  doc.setFont(undefined, 'bold')
  doc.text(10, 10, kNewlines((kk = kk + 2)) + parseFromLangKey('disclaimer_title'))
  // doc.line(10, calculateY(kk), 10 + doc.getTextWidth('Recommendation'), calculateY(kk))
  doc.setFont(undefined, 'normal')
  doc.text(
    10,
    10,
    doc.splitTextToSize(kNewlines((kk = kk + 2)) + parseFromLangKey('disclaimer'), 180),
  )
}

export function calculateY(coor) {
  return coor * 4.0569 + 10.2
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

export function generate_pdf_updated(
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
  mental,
  social,
  podiatry,
  mammobus,
  hpv,
) {
  console.log("TRIAGE", triage);
  setLangUpdated(reg.registrationQ14)
  let content = []

  content.push(...patientSection(reg, patients))
  content.push(...temperatureSection(triage))
  content.push(...bloodPressureSection(triage))
  content.push(...bmiSection(triage.triageQ10, triage.triageQ11, triage.triageQ12))
  content.push(...otherScreeningModularitiesSection(reg, geriVision, podiatry, vaccine))
  //content.push({ text: '', pageBreak: 'before' })
  content.push(
    ...followUpSection(
      reg,
      vaccine,
      hsg,
      lung,
      phlebotomy,
      fit,
      wce,
      nkf,
      grace,
      hearts,
      oralHealth,
      mental,
      mammobus,
      hpv,
      socialService,
    ),
  )
  content.push(...memoSection(geriAudiometry, dietitiansConsult, geriPtConsult, geriOtConsult, doctorSConsult))
  content.push(...recommendationSection())

  let fileName = 'Report.pdf'
  if (patients.initials) {
    fileName = patients.initials.split(' ').join('_') + '_Report.pdf'
  }

  pdfMake.fonts = {
    // download default Roboto font from cdnjs.com
    Roboto: {
      normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
      bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
      italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
      bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
    },

    NotoTamil: {
      normal: 'https://cdn.jsdelivr.net/gh/choijiwonsoc/my-fonts@main/NotoSansTamil-Regular.ttf',
      bold: 'https://cdn.jsdelivr.net/gh/choijiwonsoc/my-fonts@main/NotoSansTamil-Bold.ttf',
      italics: 'https://cdn.jsdelivr.net/gh/choijiwonsoc/my-fonts@main/NotoSansTamil-Regular.ttf',
      bolditalics: 'https://cdn.jsdelivr.net/gh/choijiwonsoc/my-fonts@main/NotoSansTamil-Regular.ttf',
    },

    // example of usage fonts in collection
    PingFangSC: {
      normal: 'https://cdn.jsdelivr.net/gh/choijiwonsoc/my-fonts@main/NotoSansSC-Regular.ttf',
      bold: 'https://cdn.jsdelivr.net/gh/choijiwonsoc/my-fonts@main/NotoSansSC-Bold.ttf',
      italics: 'https://cdn.jsdelivr.net/gh/choijiwonsoc/my-fonts@main/NotoSansSC-Regular.ttf',
      bolditalics: 'https://cdn.jsdelivr.net/gh/choijiwonsoc/my-fonts@main/NotoSansSC-Regular.ttf',
    },
  }

  const docDefinition1 = {
    content: content,
    styles: {
      header: {
        font: (reg.registrationQ14.toLowerCase() === 'tamil' ? 'NotoTamil' : (reg.registrationQ14.toLowerCase() === 'mandarin' ? 'PingFangSC' : 'Roboto')),
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      subheader: {
        font: (reg.registrationQ14.toLowerCase() === 'tamil' ? 'NotoTamil' : (reg.registrationQ14.toLowerCase() === 'mandarin' ? 'PingFangSC' : 'Roboto')),
        fontSize: 13,
        bold: true,
        margin: [0, 3, 0, 3],
      },
      normal: {
        font: (reg.registrationQ14.toLowerCase() === 'tamil' ? 'NotoTamil' : (reg.registrationQ14.toLowerCase() === 'mandarin' ? 'PingFangSC' : 'Roboto')),
        fontSize: 10,
        margin: [0, 0, 0, 4],
      },
      italicSmall: {
        font: (reg.registrationQ14.toLowerCase() === 'tamil' ? 'NotoTamil' : (reg.registrationQ14.toLowerCase() === 'mandarin' ? 'PingFangSC' : 'Roboto')),
        italics: true,
        fontSize: 10,
      },
    },
    defaultStyle: {
      font: (reg.registrationQ14.toLowerCase() === 'tamil' ? 'NotoTamil' : (reg.registrationQ14.toLowerCase() === 'mandarin' ? 'PingFangSC' : 'Roboto')),
      fontSize: 11,
    },
    pageMargins: [40, 60, 40, 60],
  }

  pdfMake.createPdf(docDefinition1).download(fileName)

}


function patientSection(reg, patients) {
  const salutation = reg.registrationQ1 || 'Dear'

  const mainLogo = {
    image: updatedLogo,
    width: 150,
  }

  const title = [{ text: parseFromLangKey('title'), style: 'header' }]

  const thanksNote = [
    { text: `${parseFromLangKey('dear', salutation, reg.registrationQ2)}`, style: 'normal' },
    { text: `${parseFromLangKey('intro')}`, style: 'normal' },
  ]

  return [mainLogo, ...title, ...thanksNote]
}

export function temperatureSection(triage) {
  const textSection = [
    { text: `${parseFromLangKey('temp_title')}`, style: 'subheader' },
    {
      text: `${parseFromLangKey('temp_reading')} ${triage.triageQ14} °C.\n`,
      style: 'normal',
    },
    {
      text: `${parseFromLangKey('temp_tip')}`,
      style: 'normal'
    },
  ]

  const imageSection = [
    {
      image: tempQR,
      width: 60,
      margin: [0, 0, 0, 5],
    },
  ]

  return [
    {
      columns: [
        { width: '*', stack: textSection },
        { width: 'auto', stack: imageSection, alignment: 'right' },
      ],
      columnGap: 13,
      margin: [0, 10, 0, 10],
    },
  ]
}


export function bloodPressureSection(triage) {
  const textSection = [
    { text: parseFromLangKey('bp_title'), style: 'subheader' },
    {
      text: `${parseFromLangKey('bp_reading')} ${triage.triageQ7}/${triage.triageQ8} mmHg.\n`,
      style: 'normal',
    },
    { text: `${parseFromLangKey('bp_tip')}`, style: 'normal' },
  ]

  const imageSection = [
    {
      image: bloodpressureQR,
      width: 60,
      margin: [0, 0, 0, 5],
    },
    {
      text: 'https://www.healthhub.sg/a-z/diseases-and-conditions/understanding-blood-pressure-readings',
      style: 'italicSmall',
      fontSize: 7,
      color: 'blue',
      link: 'https://www.healthhub.sg/a-z/diseases-and-conditions/understanding-blood-pressure-readings',
    },
  ]

  return [
    {
      columns: [
        { width: '*', stack: textSection },
        { width: 'auto', stack: imageSection, alignment: 'right' },
      ],
      columnGap: 13,
      margin: [0, 10, 0, 10],
    },
  ]
}

export function bmiSection(height, weight, bmiString) {
  const bmi = calculateBMI(Number(height), Number(weight))

  const imageSection = [
    {
      image: bmiQR,
      width: 60,
      margin: [0, 0, 0, 5],
    },
    // {
    //   text: 'https://www.healthhub.sg/live-healthy/weight_putting_me_at_risk_of_health_problems',
    //   style: 'italicSmall',
    //   fontSize: 7,
    //   color: 'blue',
    //   link: 'https://www.healthhub.sg/live-healthy/weight_putting_me_at_risk_of_health_problems',
    // },
  ]

  return [
    { text: parseFromLangKey('bmi_title'), style: 'subheader' },
    {
      text: parseFromLangKey('bmi_reading', height, weight, bmiString),
      style: 'normal',
    },

    {
      columns: [
        {
          style: 'tableExample',
          margin: [0, 5, 0, 5],
          table: {
            widths: ['*', '*'],
            body: [
              [
                { text: parseFromLangKey('bmi_tbl_l_header'), style: 'tableHeader', bold: true },
                { text: parseFromLangKey('bmi_tbl_r_header'), style: 'tableHeader', bold: true },
              ],
              ['18.5 - 22.9', parseFromLangKey('bmi_tbl_low')],
              ['23.0 - 27.4', parseFromLangKey('bmi_tbl_mod')],
              ['27.5 - 32.4', parseFromLangKey('bmi_tbl_high')],
              ['32.5 - 37.4', parseFromLangKey('bmi_tbl_vhigh')],
            ],
          },
          layout: {
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => 'black',
            vLineColor: () => 'black',
          },
        },
        { width: 'auto', stack: imageSection, alignment: 'right' },
      ],
    },
    { text: '', margin: [0, 5] },
  ]
}

export function otherScreeningModularitiesSection(reg, eye, podiatry, vaccine) {

  return [
    { text: parseFromLangKey('other_title'), style: 'subheader' },
    { text: `${parseFromLangKey('other_eye')}\n`, style: 'normal' },
    ...(reg?.registrationQ4 >= 60
      ? [{
        columns: [
          {
            width: '70%',
            style: 'tableExample',
            margin: [0, 5, 0, 5],
            table: {
              widths: ['*', '*', '*'],
              body: [
                [
                  { text: '', style: 'tableHeader' },
                  {
                    text: parseFromLangKey('other_eye_tbl_l_header'),
                    style: 'tableHeader',
                    bold: true,
                  },
                  {
                    text: parseFromLangKey('other_eye_tbl_r_header'),
                    style: 'tableHeader',
                    bold: true,
                  },
                ],
                [
                  parseFromLangKey('other_eye_tbl_t_row'),
                  `6/${eye.OphthalQ3}`,
                  `6/${eye.OphthalQ4}`,
                ],
                [
                  parseFromLangKey('other_eye_tbl_b_row'),
                  `6/${eye.OphthalQ5}`,
                  `6/${eye.OphthalQ6}`,
                ],
              ],
            },
            layout: {
              hLineWidth: () => 0.5,
              vLineWidth: () => 0.5,
              hLineColor: () => 'black',
              vLineColor: () => 'black',
            },
          },
          {
            width: '*', // takes remaining space
            text: '', // or you can add other content here or leave blank
          },
        ],
      },
      { text: '', margin: [0, 5] },
      { text: `${parseFromLangKey('other_eye_error')} ${eye.OphthalQ8}\n`, style: 'normal' }]
      : []),
    { text: '', margin: [0, 5] },
    ...(podiatry?.podiatryQ1 === "Yes"
      ? [{ text: `${parseFromLangKey('podiatry_screening_true')}\n`, style: 'normal' }]
      : []),
    ...(vaccine?.VAX1 === "Yes"
      ? [{ text: `${parseFromLangKey('vaccine_1')}\n`, style: 'normal' }]
      : []),
    ...(vaccine?.VAX2 === "Yes"
      ? [{ text: `${parseFromLangKey('vaccine_2')}\n`, style: 'normal', margin: [20, 0, 0, 0] }]
      : []),
    ...(vaccine?.VAX3 === "Yes"
      ? [{ text: `${parseFromLangKey('vaccine_3')}\n`, style: 'normal', margin: [20, 0, 0, 20] }]
      : []),
  ]
}

export function followUpSection(
  reg,
  vaccine,
  hsg,
  lung,
  phlebotomy,
  fit,
  wce,
  nkf,
  grace,
  geriWhForm,
  oral,
  mental,
  mammobus,
  hpv,
  socialService,
) {
  let vaccineString = null
  if (vaccine.VAX1 == 'Yes') {
    vaccineString = `${parseFromLangKey('fw_vax', vaccine.VAX2)}\n`
  }

  let hsgString = null
  if (hsg.HSG1 == 'Yes, I signed up for HSG today') {
    hsgString = `${parseFromLangKey('fw_hsg')}\n`
  }

  let lungString = null
  if (lung.LUNG2 == "Yes") {
    lungString = `${parseFromLangKey('fw_lung')}\n`
  }

  let mammobusString = null
  if (mammobus.mammobusQ1 == "Yes") {
    mammobusString = `${parseFromLangKey('fw_mammobus')}\n`
  }

  let hpvString = null
  if (hpv.HPV1 == "Yes") {
    hpvString = `${parseFromLangKey('fw_hpv')}\n`
  }

  let mentalString = null
  if (mental.SAMH2 == 'Yes') {
    mentalString = `${parseFromLangKey('fw_samh')}\n`
  }

  let graceString = null
  if (grace.GRACE2 == 'Yes') {
    graceString = `${parseFromLangKey('fw_grace', grace.GRACE3)}\n`
  }

  let whisperString = null
  if (geriWhForm.WH1 == 'Yes') {
    whisperString = `${parseFromLangKey('fw_wh')}\n`
  }

  let aicString = null
  if (socialService.socialServiceQ4 == "Yes") {
    aicString = `${parseFromLangKey('fw_aic')}\n`
  }

  let oralString = null
  if (oral.DENT4 == 'Yes') {
    oralString = `${parseFromLangKey('fw_dent')}\n`
  }

  return [
    { text: parseFromLangKey('fw_title'), style: 'subheader' },
    { text: parseFromLangKey('fw_intro'), style: 'normal' },
    //...(vaccineString ? [{ text: vaccineString, style: 'normal' }] : []),
    ...(hsgString ? [{ text: hsgString, style: 'normal' }] : []),
    ...(lungString ? [{ text: lungString, style: 'normal' }] : []),
    // ...(phlebotomyString ? [{ text: phlebotomyString, style: 'normal' }] : []),
    ,
    // ...(fitString ? [{ text: fitString, style: 'normal' }] : []),
    // ...(hpvString ? [{ text: hpvString, style: 'normal' }] : []),
    // ...(nkfString ? [{ text: nkfString, style: 'normal' }] : []),

    ...(graceString ? [{ text: graceString, style: 'normal' }] : []),
    ...(oralString ? [{ text: oralString, style: 'normal' }] : []),
    ...(aicString ? [{ text: aicString, style: 'normal' }] : []),
    ...(mentalString ? [{ text: mentalString, style: 'normal' }] : []),
    ...(mammobusString ? [{ text: mammobusString, style: 'normal' }] : []),
    ...(hpvString ? [{ text: hpvString, style: 'normal' }] : []),
    //...(whisperString ? [{ text: whisperString, style: 'normal' }] : []),
    { text: '', margin: [0, 5] },
    //{ text: parseFromLangKey('fw_empty'), style: 'normal' },
  ]
}

export function memoSection(audioData, dietData, ptData, otData, doctorData) {
  let audio =
    parseFromLangKey('memo_audio') +
    parseFromLangKey('memo_audio_1', audioData.AudiometryQ12) +
    parseFromLangKey('memo_audio_2', audioData.AudiometryQ13)

  let diet = parseFromLangKey('memo_diet') + `${dietData.dietitiansConsultQ4}`
  if (dietData.dietitiansConsultQ5) {
    diet += parseFromLangKey(
      'memo_diet_1',
      dietData.dietitiansConsultQ5,
      dietData.dietitiansConsultQ6,
    )
  }

  const pt = parseFromLangKey('memo_pt') + `${ptData.geriPtConsultQ1}`
  const ot = parseFromLangKey('memo_ot') + `${otData.geriOtConsultQ1}`
  const doctor = parseFromLangKey('memo_doctor') + `${doctorData.doctorSConsultQ3}`

  return [
    { text: parseFromLangKey('memo_title'), style: 'subheader' },
    {
      table: {
        widths: ['*'],
        body: [

          [{ text: diet, style: 'normal' }],
          [{ text: pt, style: 'normal' }],
          [{ text: ot, style: 'normal' }],
          [{ text: audio, style: 'normal' }],
          [{ text: doctor, style: 'normal' }],
        ],
      },
      layout: {
        fillColor: () => null,
        hLineColor: () => '#444',
        vLineColor: () => '#444',
      },
      margin: [0, 0, 0, 10],
    },
  ]
}

export function recommendationSection() {
  return [
    { text: parseFromLangKey('rec_title'), style: 'subheader' },
    { text: `${parseFromLangKey('rec')}\n`, style: 'normal' },
    { text: '', margin: [0, 5] },
    { text: parseFromLangKey('disclaimer_title'), style: 'subheader' },
    { text: `${parseFromLangKey('disclaimer')}\n`, style: 'normal' },
  ]
}

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

export const generateDoctorPdf = async (entry) => {
  const savedDoctorConsultData = await getSavedData(entry.patientId, 'doctorConsultForm')
  console.log('savedDoctorConsultData: ', savedDoctorConsultData)

  const generateHeader = () => ({
    margin: [40, 30, 40, 10],
    stack: [
      {
        columns: [
          { width: '*', text: '' },
          {
            width: 'auto',
            stack: [
              {
                text: 'PHS 2025',
                bold: true,
                fontSize: 16,
                alignment: 'center',
                margin: [0, 0, 0, 2],
              },
              {
                text: "DOCTOR'S STATION",
                bold: true,
                fontSize: 16,
                alignment: 'center',
                margin: [0, 0, 0, 2],
              },
              { text: 'MEMO SHEET', bold: true, fontSize: 16, alignment: 'center' },
            ],
          },
          {
            width: '*',
            stack: [
              {
                image: updatedLogo,
                width: 115,
                alignment: 'right',
                margin: [-10, -10, 0, 0],
              },
            ],
          },
        ],
      },
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }],
        margin: [0, 10, 0, 0],
      },
    ],
  })

  const generateMemoBody = () => {
    const content = [
      { text: 'Memo for ______________________', margin: [0, 20, 0, 2], alignment: 'center' },
      { text: 'NRIC: ______________________', margin: [0, 6, 0, 2], alignment: 'center' },
      { text: 'Dear Colleague:', margin: [0, 15, 0, 10] },

      // Doctor's Memo
      {
        stack: [
          { text: "Doctor's Memo:", bold: true, decoration: 'underline', margin: [0, 2, 0, 2] },
          { text: savedDoctorConsultData?.doctorSConsultQ2 || 'No response' },
        ],
        margin: [0, 2, 0, 5],
      },

      // Clinical Findings
      {
        stack: [
          { text: 'Clinical Findings:', bold: true, decoration: 'underline', margin: [0, 2, 0, 2] },
          { text: savedDoctorConsultData?.doctorSConsultQ3 || 'No response' },
        ],
        margin: [0, 2, 0, 10],
      },
    ]

    content.push({ text: '\nThank you very much.', margin: [0, 2, 0, 10] })

    return content
  }

  const generateSignatureBlock = () => ({
    margin: [0, 0, 0, 20],
    stack: [
      {
        text: 'Yours Sincerely,\nDr\nMCR:\nPhysician volunteer\nPublic Health Service',
        margin: [0, 10, 0, 2],
      },
      {
        text: "NUS Medical Society, c/o The Dean's Office, NUS Yong Loo Lin School of Medicine\n1E Kent Ridge Road, NUHS Tower Block Level 11, Singapore 119228",
      },
    ],
  })

  const generateFooter = () => ({
    margin: [40, 60, 40, 20],
    columns: [
      {
        canvas: [
          { type: 'line', x1: 0, y1: 0, x2: 150, y2: 0, lineWidth: 1.2, lineColor: '#1b73e8' },
        ],
        width: 100,
      },
      {
        text: 'Public Health Service 2025 [\u00A0\u00A0]',
        alignment: 'right',
        fontSize: 9,
      },
    ],
  })

  const docDefinition = {
    content: [generateMemoBody(), generateSignatureBlock()],
    header: generateHeader,
    footer: generateFooter,
    pageMargins: [40, 110, 40, 120],
    defaultStyle: { fontSize: 10 },
  }

  pdfMake.createPdf(docDefinition).download(`DoctorConsult_${entry.patientId}.pdf`)
}

async function updateGeriGraceEligibility(args, patientId, formCollection, patientsRecord) {
  if (formCollection == 'geriAmtForm') {
    const eligibleForGrace = args.geriAmtQ12 === 'Yes (Eligible for G-RACE)'
    await patientsRecord.updateOne(
      { queueNo: patientId },
      { $set: { isEligibleForGrace: eligibleForGrace } },
    )
  }
}

export const generateFormAPdf = async (patientId) => {
  const [pmhx, hxsocial, reg, hxfamily, triage, hcsr, hxoral, wce, phq, hxm4m5, hxgynae] = await Promise.all([
    getSavedData(patientId, allForms.hxNssForm),
    getSavedData(patientId, allForms.hxSocialForm),
    getSavedData(patientId, allForms.registrationForm),
    getSavedData(patientId, allForms.hxFamilyForm),
    getSavedData(patientId, allForms.triageForm),
    getSavedData(patientId, allForms.hxHcsrForm),
    getSavedData(patientId, allForms.hxOralForm),
    getSavedData(patientId, allForms.wceForm),
    getSavedData(patientId, allForms.geriPhqForm),
    getSavedData(patientId, allForms.hxM4M5ReviewForm),
    getSavedData(patientId, allForms.hxGynaeForm),
  ])

  const formData = { reg, pmhx, hxsocial, hxfamily, triage, hcsr, hxoral, wce, phq, hxm4m5, hxgynae };
  const eligibilityRows = getEligibilityRows(formData);
  const patient = await getSavedPatientData(patientId, 'patients')

  const docDefinition = {
    pageOrientation: 'landscape',
    styles: {
      header: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      subheader: {
        fontSize: 11,
        bold: true,
      },
      normal: {
        fontSize: 10,
      },
      italicSmall: {
        italics: true,
        fontSize: 8,
      },
    },
    defaultStyle: {
      fontSize: 10,
    },
    pageMargins: [40, 60, 40, 60],
    content: [
      patientIdSection(patient),
      chasStatusSection(reg),
      pioneerGenSection(reg),
      triageTableSection(triage),
      eligibilitySection(eligibilityRows, pmhx),
      ...picSections()
    ]
  };

  let fileName = 'Report.pdf'
  if (patient.initials) {
    fileName = patient.initials.split(' ').join('_') + '_FormA.pdf'
  }
  pdfMake.createPdf(docDefinition).download(fileName)
};

function patientIdSection(patient) {
  return {
    columns: [
      {
        text: `Patient ID: ${patient.queueNo ?? 'N/A'}    Initials: ${patient.initials ?? 'N/A'}`,
        fontSize: 12,
        bold: true,
        alignment: 'right',
        margin: [0, -25, 0, 5]
      }
    ],
    margin: [0, 0, 0, 5]
  };
}

function eligibilitySection(eligibilityRows, pmhx = {}) {
  const isNutritionistEligible = pmhx?.PMHX5?.includes("Hypertension") || pmhx?.PMHX5?.includes("Hyperlipidemia") || pmhx?.PMHX5?.includes("Diabetes/Pre-Diabetic")
  const isDieticianEligible = pmhx?.PMHX5?.includes("Kidney Disease") || pmhx?.PMHX5?.includes("Heart disease") || pmhx?.PMHX5?.includes("Others")
  const dietText =
  isNutritionistEligible && isDieticianEligible ? "Nutritionist & Dietitians" :
  isNutritionistEligible ? "Nutritionist" :
  isDieticianEligible ? "Dietitians" : "";

  const col1Labels = [
    '4', '5', '6', '7', '8', '9', '', '', '', '', '10', '11', '12',
    '13', '14', '15', '16', '17', '18', '19'
  ];

  const col2Texts = [
    { label: 'Healthier SG Booth', eligibilityKey: 'Healthier SG Booth' },
    { label: 'Lung Function Testing', eligibilityKey: 'Lung Function Testing' },
    { label: 'Womens Cancer Education', eligibilityKey: "Women's Cancer Education" },
    { label: 'Podiatry', eligibilityKey: 'Podiatry' },
    { label: 'Nutritionist/Dietitians Consult', eligibilityKey: "Nutritionist's/Dietitian's Consult" },
    { label: 'Geriatic Screening', eligibilityKey: 'Geriatric Screening' },
    { label: '    Cognitive Function', eligibilityKey: 'Geriatric Screening' }, // grouped under GS
    { label: '    Mobility', eligibilityKey: 'Geriatric Screening' },
    { label: '', eligibilityKey: '' },
    { label: '', eligibilityKey: '' },
    { label: 'Visual Acuity', eligibilityKey: 'Ophthalmology' },
    { label: 'Dental Health', eligibilityKey: 'Oral Health' },
    { label: 'Social Services', eligibilityKey: 'Social Services' },
    { label: 'Mental Health', eligibilityKey: 'Mental Health' },
    { label: 'Mammobus', eligibilityKey: 'Mammobus' },
    { label: 'HPV On-Site Testing', eligibilityKey: 'HPV On-Site Testing' },
    { label: 'Audiometry', eligibilityKey: 'Audiometry' },
    { label: 'Vaccination', eligibilityKey: 'Vaccination' },
    { label: 'Doctors Station', eligibilityKey: "Doctor's Station" },
    { label: 'Screening Review', eligibilityKey: '' }, // no eligibility tracking
  ];


  const col5Texts = [
    {
      stack: [
        {
          columns: [
            { image: uncheckedBox, width: 10, margin: [-2, 0, 5, 0] },
            { text: 'Have not previously been enrolled in HSG', fontSize: 9 },
          ]
        }
      ]
    },
    { text: '' },
    { text: '' },
    { text: '' },
    (dietText
    ? { text: `Eligible for: ${dietText}`, fontSize: 9, bold: true }
    : { text: '' }),
    {
      stack: [
        {
          columns: [
            { image: uncheckedBox, width: 10, margin: [-2, 0, 5, 0] },
            { text: '>= 60 years old', fontSize: 9 }
          ]
        }
      ]
    },
    { text: '' },
    {
      rowSpan: 3,
      stack: [
        {
          columns: [
            { image: uncheckedBox, width: 10, margin: [-2, 0, 2, 0] },
            { text: 'OT Questionnaire (HOMEFAST)', fontSize: 9, margin: [0, 0, 0, 4] },
            { image: uncheckedBox, width: 10, margin: [-2, 0, 2, 0] },
            { text: 'PT Questionnaire (PAL Qx)', fontSize: 9, margin: [0, 0, 0, 4] }
          ]
        },
        {
          columns: [
            { image: uncheckedBox, width: 10, margin: [-2, 0, 2, 0] },
            { text: 'Physical Tests (SPPB)', fontSize: 9, margin: [0, 0, 0, 4] },
          ]
        },
        {
          columns: [
            { text: 'Recommended for:', margin: [-2, 0, 2, 0], fontSize: 9 },
            { image: uncheckedBox, width: 10, margin: [-2, 0, 2, 0] },
            { text: 'PT Consult', fontSize: 9 },
            { image: uncheckedBox, width: 10, margin: [-2, 0, 2, 0] },
            { text: 'OT Consult', fontSize: 9 }
          ]
        }
      ]
    },
    { text: '' },
    { text: '' },
    { text: '' },
    { text: '' },
    { text: '' },
    { text: '' },
    { text: '' },
    { text: '' },
    { text: 'Part of Geriatric Screening', fontSize: 9 },
    { text: '' },
    { text: 'Please refer above to part 15A for details on reason(s) for recommendation', fontSize: 9 },
    { text: '' },
  ];

  const col3Eligible = col2Texts.map(({ eligibilityKey }, i) => {
    if (i >= 6 && i <= 9) { // Geri screening merged cells
      return '';
    }
    if (i === 19) { // Screening review
      return { text: "YES", alignment: 'center', color: 'blue' };
    }
    const eligibility = eligibilityRows.find((r) => r.name === eligibilityKey)?.eligibility;
    return {
      text: eligibility,
      alignment: 'center',
      color: eligibility === 'YES' ? 'blue' : 'red',
    };
  });

  const col4Eligible = col2Texts.map((_, i) => {
    if (i == 8) {
      return 'PT Consult:    YES   /   NO';
    } else if (i == 9) {
      return 'OT Consult:    YES   /   NO';
    } else {
      return { text: 'YES          /          NO', alignment: 'center' };
    }
  });



  const sectionTable = {
    table: {
      widths: ['3%', '19%', '15%', '15%', '48%'],
      body: [
        // Header row
        [
          { text: '', bold: true, fontSize: 10, },
          { text: 'Modality', bold: true, fontSize: 9, },
          { text: 'ELIGIBLE?', bold: true, fontSize: 9, alignment: 'center' },
          { text: 'COMPLETED?', bold: true, fontSize: 9, alignment: 'center' },
          { text: 'Details', bold: true, fontSize: 9, }
        ],
        // Rows 0–4: normal
        ...[0, 1, 2, 3, 4].map((i) => [
          { text: col1Labels[i], fontSize: 10 },
          { text: col2Texts[i].label, fontSize: 11 },
          { text: col3Eligible[i], fontSize: 9 },
          { text: col4Eligible[i], fontSize: 9 },
          col5Texts[i]
        ]),
        // Row 5 (Geriatric Screening) with ELIGIBLE? rowSpan=5
        [
          { text: 9, fontSize: 10, rowSpan: 5 },
          { text: col2Texts[5].label, fontSize: 11 },
          { ...col3Eligible[5], fontSize: 9, alignment: 'center', rowSpan: 5 },
          { text: col4Eligible[5], fontSize: 9 },
          col5Texts[5]
        ],
        // Row 6 (Cognitive Function)
        [
          { text: '', fontSize: 10 },
          { text: col2Texts[6].label, fontSize: 9, preserveLeadingSpaces: true },
          '', // skip because of rowSpan
          { text: col4Eligible[6], fontSize: 9 },
          col5Texts[6]
        ],
        // Row 7 (Mobility) with rowSpan=3
        [
          { text: '', fontSize: 10 },
          { text: col2Texts[7].label, fontSize: 9, rowSpan: 3, preserveLeadingSpaces: true },
          '', // skip
          { text: col4Eligible[7], fontSize: 9 },
          col5Texts[7]
        ],
        // Rows 8–19: normal
        ...[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((i) => [
          { text: col1Labels[i], fontSize: 9 },
          { text: col2Texts[i].label, fontSize: 11 },
          { text: col3Eligible[i], fontSize: 9 },
          { text: col4Eligible[i], fontSize: 9 },
          col5Texts[i]
        ])
      ]
    },
    layout: {
      hLineWidth: () => 0.5,
      vLineWidth: () => 0.5,
      hLineColor: () => 'black',
      vLineColor: () => 'black',
    },
    margin: [0, 5, 0, 5]
  };
  return sectionTable;
}

function chasStatusSection(reg) {
  const chasStatus = reg?.registrationQ12
  const chasOptions = {
    blue: chasStatus === 'CHAS Blue' ? checkedBox : uncheckedBox,
    orange: chasStatus === 'CHAS Orange' ? checkedBox : uncheckedBox,
    green: chasStatus === 'CHAS Green' ? checkedBox : uncheckedBox,
    none: chasStatus === 'No CHAS' ? checkedBox : uncheckedBox,
  };

  // CHAS Status Section
  const chasSection = {
    stack: [
      {
        columns: [
          {
            text: 'FORM A',
            bold: true,
            fontSize: 20,
            margin: [0, -35, 0, 5],
            alignment: 'center'
          }
        ],
        width: 'auto'
      },
      {
        columns: [
          {
            columns: [
              {
                text: 'CHAS Status:',
                style: 'sectionSubheader',
              }
            ],
            width: 'auto',
            margin: [0, -5, 0, -5]
          },
          {
            columns: [
              { image: `${chasOptions.blue} `, width: 10 },
              { text: 'CHAS Blue', style: 'checkboxLabel' }
            ],
            width: 'auto',
            margin: [0, -5, 0, -5]
          },
          {
            columns: [
              { image: `${chasOptions.orange} `, width: 10 },
              { text: 'CHAS Orange', style: 'checkboxLabel' }
            ],
            width: 'auto',
            margin: [0, -5, 0, -5]
          },
          {
            columns: [
              { image: `${chasOptions.green} `, width: 10 },
              { text: 'CHAS Green', style: 'checkboxLabel' }
            ],
            width: 'auto',
            margin: [0, -5, 0, -5]
          },
          {
            columns: [
              { image: `${chasOptions.none} `, width: 10 },
              { text: 'No CHAS', style: 'checkboxLabel' }
            ],
            width: 'auto',
            margin: [0, -5, 0, -5]
          },
        ],
        columnGap: 15,
        // margin: [15, 0, 0, 10]
      }
    ],
    margin: [0, -5, 0, 15]
  };
  return chasSection;
}

function pioneerGenSection(reg) {
  const isPioneerGen = reg?.registrationQ13 === 'Pioneer generation card holder'; // Default to 'none' if not specified
  const isPioneerGenOptions = {
    isPioneer: isPioneerGen === true ? checkedBox : uncheckedBox,
    isNotPioneer: isPioneerGen === false ? checkedBox : uncheckedBox,
  };

  // Pioneer Section
  const pioneerSection = {
    stack: [
      {
        columns: [
          {
            columns: [
              {
                text: 'Pioneer Generation:',
                style: 'sectionSubheader',
              }
            ],
            width: 'auto'
          },
          {
            columns: [
              { image: `${isPioneerGenOptions.isPioneer} `, width: 10 },
              { text: 'Yes', style: 'checkboxLabel' }
            ],
            width: 'auto'
          },
          {
            columns: [
              { image: `${isPioneerGenOptions.isNotPioneer} `, width: 10 },
              { text: 'No', style: 'checkboxLabel' }
            ],
            width: 'auto'
          },

        ],
        columnGap: 15,
        margin: [0, 0, 0, -5]
      }
    ],
    margin: [0, 0, 0, 10]
  };
  return pioneerSection;
}

function formatTriage(triage = {}) {
  const {
    triageQ1, triageQ2, triageQ3, triageQ4,
    triageQ5, triageQ6, triageQ10, triageQ11,
    triageQ12, triageQ13, triageQ7, triageQ8
  } = triage

  return {
    weightStr: triageQ11 ? `${triageQ11} kg` : '____ kg',
    heightStr: triageQ10 ? `${triageQ10} cm` : '____ cm',
    bmiStr: triageQ12 ? `${triageQ12} kg/m\u00B2` : '____ kg/m\u00B2',
    bp1: `${triageQ1 ?? '___'} / ${triageQ2 ?? '___'}`,
    bp2: `${triageQ3 ?? '___'} / ${triageQ4 ?? '___'}`,
    bp3: `${triageQ5 ?? '___'} / ${triageQ6 ?? '___'}`,
    avgBP: `${triageQ7 ?? '____'} / ${triageQ8 ?? '____'}`,
    waist: triageQ13 ? `${triageQ13} cm` : '____ cm'
  }
}

function triageTableSection(triage = {}) {
  const {
    weightStr, heightStr, bmiStr,
    bp1, bp2, bp3, avgBP, waist
  } = formatTriage(triage)

  return {
    table: {
      widths: ['15%', '25%', '30%', '30%'], // Adjust widths as needed
      body: [
        [
          { text: '2. TRIAGE', colSpan: 2, bold: true }, {},
          { text: '15A. Reasons for recommendation to Doctors Station', colSpan: 2, bold: true }, {}
        ],
        [
          {
            stack: [
              {
                columns: [
                  { text: 'WEIGHT:', bold: true, fontSize: 9 },
                  { text: weightStr, fontSize: 9, }
                ],
                margin: [0, 2, 0, 2]
              },
              {
                columns: [
                  { text: 'HEIGHT:', bold: true, fontSize: 9 },
                  { text: heightStr, fontSize: 9, }
                ],
                margin: [0, 2, 0, 2]
              },
              {
                columns: [
                  { text: 'BMI:', bold: true, fontSize: 9 },
                  { text: bmiStr, fontSize: 9, }
                ],
                margin: [0, 2, 0, 2]
              }
            ],
            margin: [0, 4, 0, 4]
          },
          // Middle column: BP and waist
          {
            stack: [
              {
                text: [
                  { text: '1st BP: ', bold: true, fontSize: 9 },
                  { text: `${bp1}      `, fontSize: 9 },
                  { text: '2nd BP: ', bold: true, fontSize: 9 },
                  { text: `${bp2}`, fontSize: 9 }
                ],
                margin: [0, 2, 0, 2]
              },
              {
                text: [
                  { text: '3rd BP: ', bold: true, fontSize: 9 },
                  { text: `${bp3}      `, fontSize: 9 },
                  { text: 'AVE. BP: ', bold: true, fontSize: 9 },
                  { text: `${avgBP}`, fontSize: 9 }
                ],
                margin: [0, 2, 0, 2]
              },
              { text: `Waist circumference: ${waist}`, fontSize: 9, margin: [0, 2, 0, 2] },
            ],
            margin: [0, 4, 0, 4]
          },
          {
            stack: [
              { text: 'Referred from:', fontSize: 9, margin: [0, 2, 0, 2] },
              { text: 'Reason:', fontSize: 9, margin: [0, 2, 0, 2] }
            ],
            margin: [0, 4, 0, 4],
          },
          {
            stack: [
              { text: 'Referred from:', fontSize: 9, margin: [0, 2, 0, 2] },
              { text: 'Reason:', fontSize: 9, margin: [0, 2, 0, 2] }
            ],
            margin: [0, 4, 0, 4],
          },
        ]
      ]
    },
    layout: {
      hLineWidth: () => 0.5,
      vLineWidth: () => 0.5,
      hLineColor: () => 'black',
      vLineColor: () => 'black',
    },
    margin: [0, 0, 0, 5]
  }
}


let formAImages = [pic1, pic2];


// Old picSections function, was changed on 17 Aug 12:45am to accomodate for unwanted page break when patient ID was added to form A
// Feel free to uncomment this if form A generation is broken
// function picSections() {
//   return formAImages
//     .filter(img => !!img)
//     .map((img, index) => ({
//       pageBreak: index === 0 ? 'before' : 'before',
//       stack: [
//         {
//           image: img,
//           width: 700,
//           alignment: 'center',
//         }
//       ],
//     }));
// }

// New picSections function to handle unwanted page break after page 1 of Form A
function picSections() {
  return formAImages
    .filter(img => !!img)
    .map((img, index) => ({
      ...(index > 0 ? { pageBreak: 'before' } : {}),
      stack: [
        {
          image: img,
          width: 700,
          alignment: 'center',
        }
      ],
    }));
}

export const checkFormA = async (patientId) => {
  const patient = await getSavedPatientData(patientId, 'patients')
  const status = generateStatusObject(patient)

  if (status.reg && status.triage && status.hxtaking) {
    await addToFormAQueue(patientId)
  }
}