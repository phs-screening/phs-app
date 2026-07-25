import { describe, expect, it } from 'vitest'
import { calculateAgeFromBirthday } from '../../src/utils/calculateAge'

describe('calculateAgeFromBirthday', () => {
  const referenceDate = '2026-07-25'

  it.each([
    ['1961-07-24', 65],
    ['1961-07-25', 65],
    ['1961-07-26', 64],
    ['1961-12-31', 64],
  ])('calculates attained age for a %s birthday', (birthday, expectedAge) => {
    expect(calculateAgeFromBirthday(birthday, referenceDate)).toBe(expectedAge)
  })

  it('handles a leap-day birthday in a non-leap year', () => {
    expect(calculateAgeFromBirthday('2000-02-29', '2025-02-27')).toBe(24)
    expect(calculateAgeFromBirthday('2000-02-29', '2025-02-28')).toBe(25)
  })

  it('returns zero for an invalid or future birthday', () => {
    expect(calculateAgeFromBirthday('invalid', referenceDate)).toBe(0)
    expect(calculateAgeFromBirthday('2026-07-26', referenceDate)).toBe(0)
  })
})
