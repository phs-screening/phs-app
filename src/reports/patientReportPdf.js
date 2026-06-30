import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'

import { bloodpressureQR, bmiQR } from 'src/icons/QRCodes'
import updatedLogo from 'src/icons/UpdatedIcon'
import { parseFromLangKey, setLang } from '../api/langutil'

function calculateBmiFallback(heightInCm, weightInKg) {
  const height = heightInCm / 100
  const bmi = (weightInKg / height / height).toFixed(1)

  return bmi
}

function resolveBmi(height, weight, savedBmi) {
  if (savedBmi !== null && savedBmi !== undefined && savedBmi !== '') {
    return savedBmi
  }

  return calculateBmiFallback(Number(height), Number(weight))
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
  k = addBmi(doc, k, triage.triageQ10, triage.triageQ11, triage.triageQ12)

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

export function addBmi(doc, k, height, weight, savedBmi) {
  //Bmi
  const bmi = resolveBmi(height, weight, savedBmi)

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
  const trip = null
  const clean_k = k
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
