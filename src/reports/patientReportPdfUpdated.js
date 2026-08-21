import { bloodpressureQR, bmiQR, tempQR } from 'src/icons/QRCodes'
import updatedLogo from 'src/icons/UpdatedIcon'
import { normalizeLangName, parseFromLangKey, setLangUpdated } from '../api/langutil'
import pdfMake from './pdfMake'
import { getMentalHealthReportAnswer } from './mentalHealthReportAnswers'

const FONT_FILES = {
  tamilRegular: {
    local: '/fonts/NotoSansTamil-Regular.ttf',
    fallback: 'https://cdn.jsdelivr.net/gh/choijiwonsoc/my-fonts@main/NotoSansTamil-Regular.ttf',
  },
  tamilBold: {
    local: '/fonts/NotoSansTamil-Bold.ttf',
    fallback: 'https://cdn.jsdelivr.net/gh/choijiwonsoc/my-fonts@main/NotoSansTamil-Bold.ttf',
  },
  mandarinRegular: {
    local: '/fonts/NotoSansSC-Regular.ttf',
    fallback: 'https://cdn.jsdelivr.net/gh/choijiwonsoc/my-fonts@main/NotoSansSC-Regular.ttf',
  },
  mandarinBold: {
    local: '/fonts/NotoSansSC-Bold.ttf',
    fallback: 'https://cdn.jsdelivr.net/gh/choijiwonsoc/my-fonts@main/NotoSansSC-Bold.ttf',
  },
}

const fontUrlCache = new Map()

const PLACEHOLDER3 = '___'
const PLACEHOLDER5 = '_____'
const NIL = 'NIL'

function hasReportValue(value) {
  return value !== null && value !== undefined && value !== ''
}

function toAbsoluteFontUrl(url) {
  if (/^https?:\/\//i.test(url)) return url
  if (typeof window === 'undefined') return url

  return new URL(url, window.location.origin).href
}

async function resolveFontUrl({ local, fallback }) {
  if (fontUrlCache.has(local)) return fontUrlCache.get(local)

  try {
    const response = await fetch(local, { method: 'HEAD' })
    if (response.ok) {
      const absoluteLocalUrl = toAbsoluteFontUrl(local)
      fontUrlCache.set(local, absoluteLocalUrl)
      return absoluteLocalUrl
    }
  } catch {
    // Fall back to the known CDN URL when a local font cannot be reached.
  }

  fontUrlCache.set(local, fallback)
  return fallback
}

async function buildPdfMakeFonts(language) {
  const fonts = {
    Roboto: {
      normal: 'Roboto-Regular.ttf',
      bold: 'Roboto-Regular.ttf',
      italics: 'Roboto-Regular.ttf',
      bolditalics: 'Roboto-Regular.ttf',
    },
  }

  if (language === 'tamil') {
    const [tamilRegular, tamilBold] = await Promise.all([
      resolveFontUrl(FONT_FILES.tamilRegular),
      resolveFontUrl(FONT_FILES.tamilBold),
    ])
    fonts.NotoTamil = {
      normal: tamilRegular,
      bold: tamilBold,
      italics: tamilRegular,
      bolditalics: tamilRegular,
    }
  }

  if (language === 'mandarin') {
    const [mandarinRegular, mandarinBold] = await Promise.all([
      resolveFontUrl(FONT_FILES.mandarinRegular),
      resolveFontUrl(FONT_FILES.mandarinBold),
    ])
    fonts.PingFangSC = {
      normal: mandarinRegular,
      bold: mandarinBold,
      italics: mandarinRegular,
      bolditalics: mandarinRegular,
    }
  }

  return fonts
}

function calculateBmiFallback(heightInCm, weightInKg) {
  const height = Number(heightInCm) / 100
  const weight = Number(weightInKg)

  if (!Number.isFinite(height) || !Number.isFinite(weight) || height <= 0 || weight <= 0) {
    return PLACEHOLDER3
  }

  const bmi = (weight / height / height).toFixed(1)

  return bmi
}

function resolveBmi(height, weight, savedBmi) {
  if (hasReportValue(savedBmi)) {
    return savedBmi
  }

  return calculateBmiFallback(height, weight)
}

export async function generate_pdf_updated(
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
  scoliosisData = {},
  hxOsa = {},
) {
  console.log('TRIAGE', triage)
  const language = normalizeLangName(reg?.registrationQ14)
  const reportFont =
    language === 'tamil' ? 'NotoTamil' : language === 'mandarin' ? 'PingFangSC' : 'Roboto'

  setLangUpdated(language)
  let content = []

  content.push(...patientSection(reg, patients))
  content.push(...temperatureSection(triage))
  content.push(...bloodPressureSection(triage))
  content.push(...bmiSection(triage.triageQ10, triage.triageQ11, triage.triageQ12))
  content.push(...otherScreeningModularitiesSection(reg, geriVision, podiatry))
  content.push(...vaccineSection(vaccine))
  content.push(...sleepApneaSection(hxOsa, reg, triage, triage.triageQ12))
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
  content.push(
    ...memoSection(
      scoliosisData,
      geriAudiometry,
      dietitiansConsult,
      geriPtConsult,
      geriOtConsult,
      doctorSConsult,
    ),
  )
  content.push(...recommendationSection())

  let fileName = 'Report.pdf'
  if (patients.initials) {
    fileName = patients.initials.split(' ').join('_') + '_Report.pdf'
  }

  pdfMake.fonts = await buildPdfMakeFonts(language)

  const docDefinition1 = {
    content: content,
    styles: {
      header: {
        font: reportFont,
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5],
      },
      subheader: {
        font: reportFont,
        fontSize: 13,
        bold: true,
        margin: [0, 3, 0, 3],
      },
      normal: {
        font: reportFont,
        fontSize: 10,
        margin: [0, 0, 0, 4],
      },
      italicSmall: {
        font: reportFont,
        italics: true,
        fontSize: 10,
      },
    },
    defaultStyle: {
      font: reportFont,
      fontSize: 11,
    },
    pageMargins: [40, 60, 40, 60],
  }

  pdfMake.createPdf(docDefinition1).download(fileName)
}

function patientSection(reg, patients) {
  const salutation = reg.registrationQ1 || 'Mr/Ms'

  const mainLogo = {
    image: updatedLogo,
    width: 150,
  }

  const title = [{ text: parseFromLangKey('title'), style: 'header' }]

  const thanksNote = [
    { text: `${parseFromLangKey('dear', salutation, reg.registrationQ2 ?? PLACEHOLDER5)}`, style: 'normal' },
    { text: `${parseFromLangKey('intro')}`, style: 'normal' },
  ]

  return [mainLogo, ...title, ...thanksNote]
}

export function temperatureSection(triage) {
  const textSection = [
    { text: `${parseFromLangKey('temp_title')}`, style: 'subheader' },
    {
      text: `${parseFromLangKey('temp_reading')} ${triage.triageQ14 ?? PLACEHOLDER3} °C.\n`,
      style: 'normal',
    },
    {
      text: `${parseFromLangKey('temp_tip')}`,
      style: 'normal',
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
      text: `${parseFromLangKey('bp_reading')} ${triage.triageQ7 ?? PLACEHOLDER3}/${triage.triageQ8 ?? PLACEHOLDER3} mmHg.\n`,
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
  const bmi = resolveBmi(height, weight, bmiString)

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
      text: parseFromLangKey(
        'bmi_reading',
        hasReportValue(height) ? height : PLACEHOLDER3,
        hasReportValue(weight) ? weight : PLACEHOLDER3,
        bmi,
      ),
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

export function otherScreeningModularitiesSection(reg, eye, podiatry) {
  return [
    { text: parseFromLangKey('other_title'), style: 'subheader' },
    { text: `${parseFromLangKey('other_eye')}\n`, style: 'normal' },
    ...(reg?.registrationQ4 >= 60
      ? [
          {
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
                      `6/${eye.OphthalQ4 ?? PLACEHOLDER3}`,
                      `6/${eye.OphthalQ5 ?? PLACEHOLDER3}`,
                    ],
                    [
                      parseFromLangKey('other_eye_tbl_b_row'),
                      `6/${eye.OphthalQ6 ?? PLACEHOLDER3}`,
                      `6/${eye.OphthalQ7 ?? PLACEHOLDER3}`,
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
          { text: `${parseFromLangKey('other_eye_error')} ${eye.OphthalQ10 ?? NIL}\n`, style: 'normal' },
        ]
      : []),
    { text: '', margin: [0, 5] },
    ...(podiatry?.podiatryQ1 === 'Yes'
      ? [{ text: `${parseFromLangKey('podiatry_screening_true')}\n`, style: 'normal' }]
      : []),
  ]
}

export function vaccineSection(vaccine = {}) {
  const vaccinesTaken = [
    ['VAX2', 'vaccine_2'],
    ['VAX3', 'vaccine_3'],
    ['VAX5', 'vaccine_5'],
  ].filter(([field]) => vaccine?.[field] === 'Yes')

  return [
    { text: parseFromLangKey('vaccine_title'), style: 'subheader' },
    ...(vaccine?.VAX1 === 'Yes'
      ? [{ text: `${parseFromLangKey('vaccine_1')}\n`, style: 'normal' }]
      : []),
    { text: `${parseFromLangKey('vaccines_taken_title')}\n`, style: 'normal', bold: true },
    ...(vaccinesTaken.length > 0
      ? vaccinesTaken.map(([, translationKey]) => ({
          text: `${parseFromLangKey(translationKey)}\n`,
          style: 'normal',
          margin: [20, 0, 0, 0],
        }))
      : [
          {
            text: `${parseFromLangKey('vaccine_none')}\n`,
            style: 'normal',
            margin: [20, 0, 0, 0],
          },
        ]),
    { text: '', margin: [0, 5] },
  ]
}

export function sleepApneaSection(hxOsa, reg, triage, bmi) {
  const osaResponsesScore = [hxOsa?.OSA1, hxOsa?.OSA2, hxOsa?.OSA3, hxOsa?.OSA4].filter(
    (response) => String(response ?? '').toLowerCase() === 'yes',
  ).length
  const sleepApneaScore =
    (reg?.registrationQ4 > 50 ? 1 : 0) +
    (String(reg?.registrationQ5 ?? '').toLowerCase() === 'male' ? 1 : 0) +
    osaResponsesScore +
    (hasReportValue(bmi) && Number(bmi) > 35 ? 1 : 0) +
    (hasReportValue(triage?.triageQ15) && Number(triage.triageQ15) > 40 ? 1 : 0)
  const recommendationKey =
    sleepApneaScore <= 2
      ? 'sleep_reco_low'
      : sleepApneaScore <= 5
        ? 'sleep_reco_medium'
        : 'sleep_reco_high'

  return [
    { text: parseFromLangKey('sleep_apnea_title'), style: 'subheader' },
    {
      text: parseFromLangKey('sleep_apnea_reading', sleepApneaScore) + parseFromLangKey(recommendationKey),
      style: 'normal',
    },
    { text: parseFromLangKey('sleep_apnea_info'), style: 'normal' },
    {
      style: 'tableExample',
      margin: [0, 5, 0, 5],
      table: {
        widths: ['*', '*'],
        body: [
          [
            {
              text: parseFromLangKey('sleep_tbl_l_header'),
              style: 'tableHeader',
              bold: true,
            },
            {
              text: parseFromLangKey('sleep_tbl_r_header'),
              style: 'tableHeader',
              bold: true,
            },
          ],
          ['0 - 2', parseFromLangKey('sleep_tbl_low')],
          ['3 - 5', parseFromLangKey('sleep_tbl_intermediate')],
          ['6 - 8', parseFromLangKey('sleep_tbl_high')],
        ],
      },
      layout: {
        hLineWidth: () => 0.5,
        vLineWidth: () => 0.5,
        hLineColor: () => 'black',
        vLineColor: () => 'black',
      },
    },
    { text: '', margin: [0, 5] },
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
  if (lung.LUNG2 == 'Yes') {
    lungString = `${parseFromLangKey('fw_lung')}\n`
  }

  let mammobusString = null
  if (mammobus.mammobusQ1 == 'Yes') {
    mammobusString = `${parseFromLangKey('fw_mammobus')}\n`
  }

  let hpvString = null
  if (hpv.HPV1 == 'Yes') {
    hpvString = `${parseFromLangKey('fw_hpv')}\n`
  }

  let mentalString = null
  if (getMentalHealthReportAnswer(mental, 2) == 'Yes') {
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
  if (socialService.socialServiceQ4 == 'Yes') {
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

export function memoSection(scoliosisData, audioData, dietData, ptData, otData, doctorData) {
  const scoliosis =
    parseFromLangKey('memo_scoliosis') + `${scoliosisData.scoliosisQ2 ?? ''}`

  let audio =
    parseFromLangKey('memo_audio') +
    parseFromLangKey('memo_audio_1', audioData.AudiometryQ12 ?? PLACEHOLDER5) +
    parseFromLangKey('memo_audio_2', audioData.AudiometryQ13 ?? PLACEHOLDER5)

  let diet = parseFromLangKey('memo_diet') + `${dietData.dietitiansConsultQ4 ?? ''}`
  if (dietData.dietitiansConsultQ5) {
    diet += parseFromLangKey(
      'memo_diet_1',
      dietData.dietitiansConsultQ5 ?? '',
      dietData.dietitiansConsultQ6 ?? '',
    )
  }

  const pt = parseFromLangKey('memo_pt') + `${ptData.geriPtConsultQ1 ?? ''}`
  const ot = parseFromLangKey('memo_ot') + `${otData.geriOtConsultQ1 ?? ''}`
  const doctor = parseFromLangKey('memo_doctor') + `${doctorData.doctorSConsultQ3 ?? ''}`

  return [
    { text: parseFromLangKey('memo_title'), style: 'subheader' },
    {
      table: {
        widths: ['*'],
        body: [
          [{ text: scoliosis, style: 'normal' }],
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

