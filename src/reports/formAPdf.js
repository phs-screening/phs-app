import allForms from '../forms/forms.json'
import { checkedBox, uncheckedBox } from '../icons/checked'
import pic1 from '../icons/pic1-forma'
import { getPatientStationSummary } from '../api/stationsApi'
import { getSavedData, getSavedPatientData } from '../services/patientData'
import pdfMake from './pdfMake'

export const generateFormAPdf = async (patientId) => {
  const [pmhx, reg, triage] = await Promise.all([
    getSavedData(patientId, allForms.hxNssForm),
    getSavedData(patientId, allForms.registrationForm),
    getSavedData(patientId, allForms.triageForm),
  ])

  const stations = await getFormAStations(patientId)
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
    pageMargins: [40, 45, 40, 35],
    footer: floorPlanFooter,
    content: [
      patientIdSection(patient),
      chasStatusSection(reg),
      pioneerGenSection(reg),
      publicAssistanceSection(reg),
      triageTableSection(triage),
      eligibilitySection(stations, pmhx),
      ...picSections(),
    ],
  }

  let fileName = 'Report.pdf'
  if (patient.initials) {
    fileName = patient.initials.split(' ').join('_') + '_FormA.pdf'
  }
  pdfMake.createPdf(docDefinition).download(fileName)
}

async function getFormAStations(patientId) {
  const summary = await getPatientStationSummary(patientId)
  const stations = summary.data?.stations || []

  if (stations.length === 0) {
    throw new Error('Backend returned no station flow.')
  }

  return stations
}

function patientIdSection(patient) {
  return {
    columns: [
      {
        text: `Patient ID: ${patient.queueNo ?? 'N/A'}    Initials: ${patient.initials ?? 'N/A'}`,
        fontSize: 12,
        bold: true,
        alignment: 'right',
        margin: [0, -25, 0, 5],
      },
    ],
    margin: [0, 0, 0, 5],
  }
}

function eligibilitySection(stations, pmhx = {}) {
  const isNutritionistEligible =
    pmhx?.PMHX5?.includes('Hypertension') ||
    pmhx?.PMHX5?.includes('Hyperlipidemia') ||
    pmhx?.PMHX5?.includes('Diabetes/Pre-Diabetic')
  const isDieticianEligible =
    pmhx?.PMHX5?.includes('Kidney Disease') ||
    pmhx?.PMHX5?.includes('Heart disease') ||
    pmhx?.PMHX5?.includes('Others')
  const dietText =
    isNutritionistEligible && isDieticianEligible
      ? 'Nutritionist & Dietitians'
      : isNutritionistEligible
        ? 'Nutritionist'
        : isDieticianEligible
          ? 'Dietitians'
          : ''

  const stationConfig = {
    mammobus: {
      number: '1a',
      label: 'Mammobus',
      details: {
        text: 'Mammobus is located at the Community Centre (CC) carpark.',
        fontSize: 9,
      },
    },
    hsg: {
      number: '4',
      label: 'Healthier SG Booth',
      details: {
        stack: [
          {
            columns: [
              { image: uncheckedBox, width: 10, margin: [-2, 0, 5, 0] },
              { text: 'Have not previously been enrolled in HSG', fontSize: 9 },
            ],
          },
        ],
      },
    },
    cancer365: { number: '5', label: '365 Cancer Screening' },
    oralhealth: { number: '6', label: 'Dental Health' },
    vax: { number: '7', label: 'Vaccination' },
    scoliosis: { number: '8', label: 'Scoliosis' },
    podiatry: { number: '9', label: 'Podiatry' },
    dietitiansconsult: {
      number: '10',
      label: 'Nutr. /Diet. Consult',
      details: dietText
        ? { text: `Eligible for: ${dietText}`, fontSize: 9, bold: true }
        : { text: '' },
    },
    wce: { number: '11', label: 'WCE & A' },
    gericog: {
      number: '12',
      label: 'Geriatric Screening',
      details: { text: '>= 60 years old', fontSize: 9 },
    },
    ophthal: { number: '12b', label: 'Visual Acuity' },
    hpv: { number: '13', label: 'HPV On-Site Testing' },
    audio: {
      number: '14',
      label: 'Audiometry',
      details: { text: 'Part of Geriatric Screening', fontSize: 9 },
    },
    socialservice: { number: '15', label: 'Social Services' },
    mentalhealth: { number: '16', label: 'Mental Health' },
    arthritis: { number: '17', label: 'Arthritis' },
    doctorsconsult: {
      number: '18',
      label: 'Doctors Station',
      details: {
        text: 'Please refer above to part 15A for details on reason(s) for recommendation',
        fontSize: 9,
      },
    },
    screeningreview: { number: '19', label: 'Screening Review' },
    ltfu: { number: '19c', label: 'Long Term Follow Up' },
  }

  const rows = stations.flatMap((station) => {
    const config = stationConfig[station.key]
    if (!config) return []

    const eligibility = station.eligible ? 'YES' : 'NO'
    return [{ ...config, eligibility }]
  })

  const sectionTable = {
    table: {
      widths: ['4%', '18%', '15%', '15%', '48%'],
      dontBreakRows: true,
      keepWithHeaderRows: 1,
      body: [
        [
          { text: '', bold: true, fontSize: 10 },
          { text: 'Modality', bold: true, fontSize: 9 },
          { text: 'ELIGIBLE?', bold: true, fontSize: 9, alignment: 'center' },
          { text: 'COMPLETED?', bold: true, fontSize: 9, alignment: 'center' },
          { text: 'Details', bold: true, fontSize: 9 },
        ],
        ...rows.map((row) => [
          { text: row.number, fontSize: 10 },
          { text: row.label, fontSize: 10 },
          {
            text: row.eligibility,
            fontSize: 9,
            alignment: 'center',
            color: row.eligibility === 'YES' ? 'blue' : 'red',
          },
          { text: 'YES          /          NO', fontSize: 9, alignment: 'center' },
          row.details || { text: '' },
        ]),
      ],
    },
    layout: {
      hLineWidth: () => 0.5,
      vLineWidth: () => 0.5,
      hLineColor: () => 'black',
      vLineColor: () => 'black',
      paddingTop: () => 1,
      paddingBottom: () => 1,
    },
    margin: [0, 5, 0, 5],
  }
  return sectionTable
}

function chasStatusSection(reg) {
  const chasStatus = reg?.registrationQ12
  const chasOptions = {
    blue: chasStatus === 'CHAS Blue' ? checkedBox : uncheckedBox,
    orange: chasStatus === 'CHAS Orange' ? checkedBox : uncheckedBox,
    green: chasStatus === 'CHAS Green' ? checkedBox : uncheckedBox,
    none: chasStatus === 'No CHAS' ? checkedBox : uncheckedBox,
  }

  const chasSection = {
    stack: [
      {
        columns: [
          {
            text: 'FORM A',
            bold: true,
            fontSize: 20,
            margin: [0, -35, 0, 5],
            alignment: 'center',
          },
        ],
        width: 'auto',
      },
      {
        columns: [
          {
            columns: [
              {
                text: 'CHAS Status:',
                style: 'sectionSubheader',
              },
            ],
            width: 'auto',
            margin: [0, -5, 0, -5],
          },
          {
            columns: [
              { image: `${chasOptions.blue} `, width: 10 },
              { text: 'CHAS Blue', style: 'checkboxLabel' },
            ],
            width: 'auto',
            margin: [0, -5, 0, -5],
          },
          {
            columns: [
              { image: `${chasOptions.orange} `, width: 10 },
              { text: 'CHAS Orange', style: 'checkboxLabel' },
            ],
            width: 'auto',
            margin: [0, -5, 0, -5],
          },
          {
            columns: [
              { image: `${chasOptions.green} `, width: 10 },
              { text: 'CHAS Green', style: 'checkboxLabel' },
            ],
            width: 'auto',
            margin: [0, -5, 0, -5],
          },
          {
            columns: [
              { image: `${chasOptions.none} `, width: 10 },
              { text: 'No CHAS', style: 'checkboxLabel' },
            ],
            width: 'auto',
            margin: [0, -5, 0, -5],
          },
        ],
        columnGap: 15,
      },
    ],
    margin: [0, -5, 0, 15],
  }
  return chasSection
}

function pioneerGenSection(reg) {
  const isPioneerGen = reg?.registrationQ13 === 'Pioneer generation card holder'
  const isPioneerGenOptions = {
    isPioneer: isPioneerGen === true ? checkedBox : uncheckedBox,
    isNotPioneer: isPioneerGen === false ? checkedBox : uncheckedBox,
  }

  const pioneerSection = {
    stack: [
      {
        columns: [
          {
            columns: [
              {
                text: 'Pioneer Generation:',
                style: 'sectionSubheader',
              },
            ],
            width: 'auto',
          },
          {
            columns: [
              { image: `${isPioneerGenOptions.isPioneer} `, width: 10 },
              { text: 'Yes', style: 'checkboxLabel' },
            ],
            width: 'auto',
          },
          {
            columns: [
              { image: `${isPioneerGenOptions.isNotPioneer} `, width: 10 },
              { text: 'No', style: 'checkboxLabel' },
            ],
            width: 'auto',
          },
        ],
        columnGap: 15,
        margin: [0, 0, 0, -5],
      },
    ],
    margin: [0, 0, 0, 10],
  }
  return pioneerSection
}

function publicAssistanceSection(reg) {
  const publicAssistance = reg?.registrationQ16
  const publicAssistanceOptions = {
    yes: publicAssistance === 'Yes' ? checkedBox : uncheckedBox,
    no: publicAssistance === 'No' ? checkedBox : uncheckedBox,
  }

  return {
    columns: [
      {
        text: 'Public Assistance Card:',
        style: 'sectionSubheader',
        width: 'auto',
      },
      {
        columns: [
          { image: `${publicAssistanceOptions.yes} `, width: 10 },
          { text: 'Yes', style: 'checkboxLabel' },
        ],
        width: 'auto',
      },
      {
        columns: [
          { image: `${publicAssistanceOptions.no} `, width: 10 },
          { text: 'No', style: 'checkboxLabel' },
        ],
        width: 'auto',
      },
    ],
    columnGap: 15,
    margin: [0, 0, 0, 10],
  }
}

function formatTriage(triage = {}) {
  const {
    triageQ1,
    triageQ2,
    triageQ3,
    triageQ4,
    triageQ5,
    triageQ6,
    triageQ10,
    triageQ11,
    triageQ12,
    triageQ13,
    triageQ7,
    triageQ8,
  } = triage

  return {
    weightStr: triageQ11 ? `${triageQ11} kg` : '____ kg',
    heightStr: triageQ10 ? `${triageQ10} cm` : '____ cm',
    bmiStr: triageQ12 ? `${triageQ12} kg/m\u00B2` : '____ kg/m\u00B2',
    bp1: `${triageQ1 ?? '___'} / ${triageQ2 ?? '___'}`,
    bp2: `${triageQ3 ?? '___'} / ${triageQ4 ?? '___'}`,
    bp3: `${triageQ5 ?? '___'} / ${triageQ6 ?? '___'}`,
    avgBP: `${triageQ7 ?? '____'} / ${triageQ8 ?? '____'}`,
    waist: triageQ13 ? `${triageQ13} cm` : '____ cm',
  }
}

function triageTableSection(triage = {}) {
  const { weightStr, heightStr, bmiStr, bp1, bp2, bp3, avgBP, waist } = formatTriage(triage)

  return {
    table: {
      widths: ['15%', '25%', '30%', '30%'],
      body: [
        [
          { text: '2. TRIAGE', colSpan: 2, bold: true },
          {},
          { text: '15A. Reasons for recommendation to Doctors Station', colSpan: 2, bold: true },
          {},
        ],
        [
          {
            stack: [
              {
                columns: [
                  { text: 'WEIGHT:', bold: true, fontSize: 9 },
                  { text: weightStr, fontSize: 9 },
                ],
                margin: [0, 2, 0, 2],
              },
              {
                columns: [
                  { text: 'HEIGHT:', bold: true, fontSize: 9 },
                  { text: heightStr, fontSize: 9 },
                ],
                margin: [0, 2, 0, 2],
              },
              {
                columns: [
                  { text: 'BMI:', bold: true, fontSize: 9 },
                  { text: bmiStr, fontSize: 9 },
                ],
                margin: [0, 2, 0, 2],
              },
            ],
            margin: [0, 4, 0, 4],
          },
          {
            stack: [
              {
                text: [
                  { text: '1st BP: ', bold: true, fontSize: 9 },
                  { text: `${bp1}      `, fontSize: 9 },
                  { text: '2nd BP: ', bold: true, fontSize: 9 },
                  { text: `${bp2}`, fontSize: 9 },
                ],
                margin: [0, 2, 0, 2],
              },
              {
                text: [
                  { text: '3rd BP: ', bold: true, fontSize: 9 },
                  { text: `${bp3}      `, fontSize: 9 },
                  { text: 'AVE. BP: ', bold: true, fontSize: 9 },
                  { text: `${avgBP}`, fontSize: 9 },
                ],
                margin: [0, 2, 0, 2],
              },
              { text: `Waist circumference: ${waist}`, fontSize: 9, margin: [0, 2, 0, 2] },
            ],
            margin: [0, 4, 0, 4],
          },
          {
            stack: [
              { text: 'Referred from:', fontSize: 9, margin: [0, 2, 0, 2] },
              { text: 'Reason:', fontSize: 9, margin: [0, 2, 0, 2] },
            ],
            margin: [0, 4, 0, 4],
          },
          {
            stack: [
              { text: 'Referred from:', fontSize: 9, margin: [0, 2, 0, 2] },
              { text: 'Reason:', fontSize: 9, margin: [0, 2, 0, 2] },
            ],
            margin: [0, 4, 0, 4],
          },
        ],
      ],
    },
    layout: {
      hLineWidth: () => 0.5,
      vLineWidth: () => 0.5,
      hLineColor: () => 'black',
      vLineColor: () => 'black',
    },
    margin: [0, 0, 0, 5],
  }
}

let formAImages = [pic1]

function floorPlanFooter(currentPage, pageCount) {
  if (currentPage !== pageCount) return null

  return {
    table: {
      widths: ['*'],
      body: [
        [
          {
            text: [
              { text: 'Disclaimer: ', bold: true },
              {
                text: 'Mammobus is located at the Community Centre (CC) carpark and is not shown on this floor plan.',
              },
            ],
            fillColor: '#FFF4CC',
            color: '#5C3B00',
            fontSize: 9,
            alignment: 'center',
            margin: [5, 3, 5, 3],
          },
        ],
      ],
    },
    layout: {
      hLineColor: () => '#B7791F',
      vLineColor: () => '#B7791F',
      hLineWidth: () => 0.75,
      vLineWidth: () => 0.75,
    },
    margin: [190, 0, 190, 0],
  }
}

function picSections() {
  return formAImages
    .filter((img) => !!img)
    .map((img) => ({
      pageBreak: 'before',
      stack: [
        {
          image: img,
          fit: [700, 470],
          alignment: 'center',
        },
      ],
    }))
}
