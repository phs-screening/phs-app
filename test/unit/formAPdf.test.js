import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  createPdf: vi.fn(),
  download: vi.fn(),
  getPatientStationSummary: vi.fn(),
  getSavedData: vi.fn(),
  getSavedPatientData: vi.fn(),
}))

vi.mock('../../src/icons/checked', () => ({
  checkedBox: 'checked-box',
  uncheckedBox: 'unchecked-box',
}))

vi.mock('../../src/icons/pic1-forma', () => ({
  default: 'floor-plan',
}))

vi.mock('../../src/api/stationsApi', () => ({
  getPatientStationSummary: mocks.getPatientStationSummary,
}))

vi.mock('../../src/services/patientData', () => ({
  getSavedData: mocks.getSavedData,
  getSavedPatientData: mocks.getSavedPatientData,
}))

vi.mock('../../src/reports/pdfMake', () => ({
  default: { createPdf: mocks.createPdf },
}))

import { generateFormAPdf } from '../../src/reports/formAPdf'

const stationKeys = [
  'reg',
  'mammobus',
  'triage',
  'hxtaking',
  'hsg',
  'cancer365',
  'oralhealth',
  'vax',
  'scoliosis',
  'podiatry',
  'dietitiansconsult',
  'wce',
  'gericog',
  'gerimobility',
  'ophthal',
  'hpv',
  'audio',
  'socialservice',
  'mentalhealth',
  'arthritis',
  'doctorsconsult',
  'screeningreview',
  'ltfu',
]

describe('generateFormAPdf', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.createPdf.mockReturnValue({ download: mocks.download })
    mocks.getPatientStationSummary.mockResolvedValue({
      data: {
        stations: stationKeys.map((key) => ({ key, eligible: true })),
      },
    })
    mocks.getSavedData
      .mockResolvedValueOnce({ PMHX5: [] })
      .mockResolvedValueOnce({ registrationQ16: 'Yes' })
      .mockResolvedValueOnce({})
    mocks.getSavedPatientData.mockResolvedValue({ queueNo: 42, initials: 'AB' })
  })

  it('uses the new station flow, public assistance status, and one-page floor plan', async () => {
    await generateFormAPdf(42)

    const docDefinition = mocks.createPdf.mock.calls[0][0]
    expect(docDefinition.pageMargins).toEqual([40, 45, 40, 35])
    const eligibilityTable = docDefinition.content.find(
      (section) => section.table?.body?.[0]?.[1]?.text === 'Modality',
    )
    const stationRows = eligibilityTable.table.body.slice(1)

    expect(eligibilityTable.table).toMatchObject({
      widths: ['4%', '18%', '15%', '15%', '48%'],
      dontBreakRows: true,
      keepWithHeaderRows: 1,
    })
    expect(eligibilityTable.layout.paddingTop()).toBe(1)
    expect(eligibilityTable.layout.paddingBottom()).toBe(1)
    expect(stationRows.map(([number]) => number.text)).toEqual([
      '1a',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '12b',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '19c',
    ])
    expect(stationRows.map(([, modality]) => modality.text)).toEqual([
      'Mammobus',
      'Healthier SG Booth',
      '365 Cancer Screening',
      'Dental Health',
      'Vaccination',
      'Scoliosis',
      'Podiatry',
      'Nutr. /Diet. Consult',
      'WCE & A',
      'Geriatric Screening',
      'Visual Acuity',
      'HPV On-Site Testing',
      'Audiometry',
      'Social Services',
      'Mental Health',
      'Arthritis',
      'Doctors Station',
      'Screening Review',
      'Long Term Follow Up',
    ])
    expect(stationRows.every(([, modality]) => modality.fontSize === 10)).toBe(true)
    // Geriatrics is a single "Geriatric Screening" row — the Cognitive/Mobility
    // split is not surfaced on Form A.
    expect(JSON.stringify(eligibilityTable)).not.toMatch(/Cognitive|Mobility/)
    expect(stationRows[0][4].text).toBe('Mammobus is located at the Community Centre (CC) carpark.')

    // Geriatric Screening lists the three mobility assessments, then a
    // Recommendation line with PT/OT consult tick boxes. All boxes print unticked.
    const geriDetails = stationRows.find(([, modality]) => modality.text === 'Geriatric Screening')[4]
    expect(geriDetails.stack[0].text).toBe('>= 60 years old')
    expect(geriDetails.stack.slice(1, 4).map((row) => row.columns[1].text)).toEqual([
      'OT Questionnaire (HOMEFAST)',
      'PT Questionnaire (PAL Qx)',
      'Physical Tests (SPPB)',
    ])
    expect(geriDetails.stack[4].text).toBe('Recommendation:')
    const recommendation = geriDetails.stack[5].columns
    expect(recommendation.map((c) => c.text).filter(Boolean)).toEqual(['PT consult', 'OT consult'])
    expect(JSON.stringify(geriDetails).match(/unchecked-box/g)).toHaveLength(5)

    const publicAssistance = docDefinition.content.find(
      (section) => section.columns?.[0]?.text === 'Public Assistance Card:',
    )
    expect(publicAssistance.columns[1].columns[0].image).toContain('checked-box')
    expect(publicAssistance.columns[2].columns[0].image).toContain('unchecked-box')

    const floorPlans = docDefinition.content.filter((section) =>
      section.stack?.some((item) => item.image === 'floor-plan'),
    )
    expect(floorPlans).toHaveLength(1)
    expect(floorPlans[0]).toMatchObject({
      pageBreak: 'before',
      stack: [{ fit: [700, 470] }],
    })

    expect(docDefinition.footer(1, 2)).toBeNull()
    expect(docDefinition.footer(2, 2)).toMatchObject({
      table: {
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
            },
          ],
        ],
      },
    })
  })
})
