import { beforeEach, describe, expect, it, vi } from 'vitest'
import enUs from '../../src/api/lang/en_us.json'
import msMy from '../../src/api/lang/ms_my.json'
import taIn from '../../src/api/lang/ta_in.json'
import zhCn from '../../src/api/lang/zh_cn.json'

const fontMocks = vi.hoisted(() => ({
  applyBold: vi.fn(),
  applyNormal: vi.fn(),
}))

vi.mock('../../src/api/lang/NotoSansSC-normal', () => ({
  default: {
    apply: fontMocks.applyNormal,
  },
}))

vi.mock('../../src/api/lang/NotoSansSC-bold', () => ({
  default: {
    apply: fontMocks.applyBold,
  },
}))

import {
  normalizeLangName,
  parseFromLangKey,
  setLang,
  setLangUpdated,
} from '../../src/api/langutil'

describe('langutil', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.stubGlobal('alert', vi.fn())
    setLangUpdated('english')
  })

  it('normalizes language names for matching', () => {
    expect(normalizeLangName('MANDARIN')).toBe('mandarin')
    expect(normalizeLangName('Malay')).toBe('malay')
    expect(normalizeLangName()).toBe('english')
    expect(normalizeLangName(null)).toBe('english')
  })

  it('parses text from the current language file and substitutes indexed values', () => {
    expect(parseFromLangKey('dear', 'Ada', 'Lovelace')).toBe('Dear Ada Lovelace,')
  })

  it('switches report text with setLangUpdated', () => {
    expect(setLangUpdated('malay')).toBe(true)
    expect(parseFromLangKey('title')).toBe(msMy.title)

    expect(setLangUpdated('mandarin')).toBe(true)
    expect(parseFromLangKey('title')).toBe(zhCn.title)

    expect(setLangUpdated('tamil')).toBe(true)
    expect(parseFromLangKey('title')).toBe(taIn.title)

    expect(setLangUpdated('english')).toBe(true)
    expect(parseFromLangKey('title')).toBe(enUs.title)
  })

  it('falls back to English and returns false for unknown languages', () => {
    setLangUpdated('malay')

    expect(setLangUpdated('klingon')).toBe(false)
    expect(parseFromLangKey('title')).toBe(enUs.title)
    expect(console.log).toHaveBeenCalledWith(
      'Tried to parse unknown language klingon for report!'
    )
  })

  it('applies Mandarin fonts when setting the jsPDF report language', () => {
    const doc = {
      setFont: vi.fn(),
    }

    expect(setLang(doc, 'mandarin')).toBe(true)

    expect(fontMocks.applyNormal).toHaveBeenCalledWith(doc)
    expect(fontMocks.applyBold).toHaveBeenCalledWith(doc)
    expect(doc.setFont).toHaveBeenCalledWith('NotoSansSC', 'normal')
    expect(parseFromLangKey('title')).toBe(zhCn.title)
  })

  it('alerts and leaves the current jsPDF language unchanged for Tamil', () => {
    const doc = {
      setFont: vi.fn(),
    }
    setLangUpdated('malay')

    expect(setLang(doc, 'tamil')).toBe(true)

    expect(alert).toHaveBeenCalledWith(
      'Unfortunately, the report generator does not work with Tamil.\nIf tamil is needed, generate the form manually.'
    )
    expect(doc.setFont).not.toHaveBeenCalled()
    expect(parseFromLangKey('title')).toBe(msMy.title)
  })

  it('returns false and falls back to English for unknown jsPDF report languages', () => {
    const doc = {
      setFont: vi.fn(),
    }
    setLangUpdated('mandarin')

    expect(setLang(doc, 'unknown')).toBe(false)

    expect(parseFromLangKey('title')).toBe(enUs.title)
    expect(console.log).toHaveBeenCalledWith(
      'Tried to parse unknown language unknown for report!'
    )
  })
})
