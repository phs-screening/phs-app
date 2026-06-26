import { describe, expect, it } from 'vitest'
import {
  FORM_COLLECTION_TO_KEY,
  hasFormKey,
  toFormKey,
} from '../../src/forms/formKeys'

describe('formKeys', () => {
  it('maps legacy form collection names to backend form keys', () => {
    expect(toFormKey('registrationForm')).toBe('registration')
    expect(toFormKey('lungFnForm')).toBe('lungFunction')
    expect(toFormKey('doctorConsultForm')).toBe('doctorConsult')
    expect(toFormKey('geriMMSEForm')).toBe('geriMmse')
    expect(toFormKey('geriOtConsultForm')).toBe('geriOtConsult')
  })

  it('returns the original value when no mapping exists', () => {
    expect(toFormKey('customForm')).toBe('customForm')
    expect(toFormKey('patients')).toBe('patients')
    expect(toFormKey(undefined)).toBeUndefined()
  })

  it('detects whether a collection has a known form key mapping', () => {
    expect(hasFormKey('registrationForm')).toBe(true)
    expect(hasFormKey('geriMMSEForm')).toBe(true)
    expect(hasFormKey('patients')).toBe(false)
    expect(hasFormKey(undefined)).toBe(false)
  })

  it('keeps expected compatibility aliases mapped to the same backend key', () => {
    expect(FORM_COLLECTION_TO_KEY.geriMmseForm).toBe('geriMmse')
    expect(FORM_COLLECTION_TO_KEY.geriMMSEForm).toBe('geriMmse')
  })
})
