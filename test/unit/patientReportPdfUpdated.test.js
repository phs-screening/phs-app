import { describe, expect, it, vi } from 'vitest'

vi.mock('src/icons/QRCodes', () => ({
  bloodpressureQR: '',
  bmiQR: '',
  tempQR: '',
}))

vi.mock('src/icons/UpdatedIcon', () => ({
  default: '',
}))

vi.mock('../../src/reports/pdfMake', () => ({
  default: {},
}))

import enUs from '../../src/api/lang/en_us.json'
import msMy from '../../src/api/lang/ms_my.json'
import taIn from '../../src/api/lang/ta_in.json'
import zhCn from '../../src/api/lang/zh_cn.json'
import { setLangUpdated } from '../../src/api/langutil'
import { memoSection, sleepApneaSection } from '../../src/reports/patientReportPdfUpdated'

function getScoliosisMemo(scoliosisData = {}) {
  const section = memoSection(scoliosisData, {}, {}, {}, {}, {})
  return section[1].table.body[0][0].text
}

function getSleepApneaSection({ hxOsa = {}, reg = {}, triage = {}, bmi = 35 } = {}) {
  setLangUpdated('english')
  return sleepApneaSection(
    hxOsa,
    { registrationQ4: 50, registrationQ5: 'Female', ...reg },
    { triageQ15: 40, ...triage },
    bmi,
  )
}

function getSleepApneaReading(input) {
  return getSleepApneaSection(input)[1].text
}

function expectedSleepApneaReading(score, recommendationKey) {
  return enUs.sleep_apnea_reading.replace('{0}', String(score)) + enUs[recommendationKey]
}

describe('patientReportPdfUpdated memoSection', () => {
  it('renders scoliosisQ2 as the first referral memo', () => {
    setLangUpdated('english')

    expect(getScoliosisMemo({ scoliosisQ2: 'Refer for follow-up' })).toBe(
      `${enUs.memo_scoliosis}Refer for follow-up`,
    )
  })

  it('leaves the scoliosis memo empty when scoliosisQ2 is missing', () => {
    setLangUpdated('english')

    expect(getScoliosisMemo()).toBe(enUs.memo_scoliosis)
  })

  it.each([
    ['english', enUs.memo_scoliosis],
    ['malay', msMy.memo_scoliosis],
    ['mandarin', zhCn.memo_scoliosis],
    ['tamil', taIn.memo_scoliosis],
  ])('uses the %s scoliosis heading', (language, heading) => {
    setLangUpdated(language)

    expect(getScoliosisMemo({ scoliosisQ2: 'Memo' })).toBe(`${heading}Memo`)
  })
})

describe('patientReportPdfUpdated sleepApneaSection', () => {
  it.each([
    ['OSA1 Yes', { hxOsa: { OSA1: 'Yes' } }],
    ['OSA2 Yes', { hxOsa: { OSA2: 'Yes' } }],
    ['OSA3 Yes', { hxOsa: { OSA3: 'Yes' } }],
    ['OSA4 Yes', { hxOsa: { OSA4: 'YES' } }],
    ['age above 50', { reg: { registrationQ4: 51 } }],
    ['male gender', { reg: { registrationQ5: 'MALE' } }],
    ['BMI above 35', { bmi: 35.1 }],
    ['neck circumference above 40 cm', { triage: { triageQ15: 40.1 } }],
  ])('adds one point for %s', (_label, input) => {
    expect(getSleepApneaReading(input)).toBe(expectedSleepApneaReading(1, 'sleep_reco_low'))
  })

  it('calculates a complete STOP-BANG score of 0', () => {
    const input = {
      hxOsa: { OSA1: 'No', OSA2: 'No', OSA3: 'No', OSA4: 'No' },
      reg: { registrationQ4: 50, registrationQ5: 'Female' },
      triage: { triageQ15: 40 },
      bmi: 35,
    }

    expect(getSleepApneaReading(input)).toBe(expectedSleepApneaReading(0, 'sleep_reco_low'))
  })

  it.each([
    [
      2,
      { hxOsa: { OSA1: 'Yes', OSA2: 'Yes' } },
      'sleep_reco_low',
    ],
    [
      3,
      { hxOsa: { OSA1: 'Yes', OSA2: 'Yes', OSA3: 'Yes' } },
      'sleep_reco_medium',
    ],
    [
      5,
      {
        hxOsa: { OSA1: 'Yes', OSA2: 'Yes', OSA3: 'Yes', OSA4: 'Yes' },
        reg: { registrationQ4: 51 },
      },
      'sleep_reco_medium',
    ],
    [
      6,
      {
        hxOsa: { OSA1: 'Yes', OSA2: 'Yes', OSA3: 'Yes', OSA4: 'Yes' },
        reg: { registrationQ4: 51, registrationQ5: 'Male' },
      },
      'sleep_reco_high',
    ],
  ])('uses the correct recommendation at score %i', (score, input, recommendationKey) => {
    expect(getSleepApneaReading(input)).toBe(
      expectedSleepApneaReading(score, recommendationKey),
    )
  })

  it('calculates the maximum STOP-BANG score of 8', () => {
    const input = {
      hxOsa: { OSA1: 'Yes', OSA2: 'Yes', OSA3: 'Yes', OSA4: 'Yes' },
      reg: { registrationQ4: 51, registrationQ5: 'Male' },
      triage: { triageQ15: 40.1 },
      bmi: 35.1,
    }

    expect(getSleepApneaReading(input)).toBe(expectedSleepApneaReading(8, 'sleep_reco_high'))
  })

  it('shows the configured low, intermediate, and high score bands', () => {
    const tableRows = getSleepApneaSection()[3].table.body.slice(1)

    expect(tableRows.map(([scoreRange]) => scoreRange)).toEqual(['0 - 2', '3 - 5', '6 - 8'])
  })
})
