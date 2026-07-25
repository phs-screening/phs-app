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
import { memoSection } from '../../src/reports/patientReportPdfUpdated'

function getScoliosisMemo(scoliosisData = {}) {
  const section = memoSection(scoliosisData, {}, {}, {}, {}, {})
  return section[1].table.body[0][0].text
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
