import { describe, it, expect } from 'vitest'
import { calculateBMI, parseWceStation } from '../api/api.jsx'

describe('calculateBMI', () => {
  it('calculates BMI and returns one decimal string', () => {
    // height 170cm, weight 70kg -> BMI = 70/(1.7*1.7) = 24.221... -> 24.2
    expect(calculateBMI(170, 70)).toBe('24.2')
  })
})

describe('parseWceStation', () => {
  it('returns additionalInfo for question 4 when answer is Yes', () => {
    const res = parseWceStation(4, 'Yes')
    expect(res.additionalInfo).toBeDefined()
    expect(res.additionalInfo).toContain('SCS')
  })

  it('returns guidance string for questions 2 and 3', () => {
    const res = parseWceStation(2, 'Any')
    expect(res.additionalInfo).toBeDefined()
    expect(res.additionalInfo).toMatch(/If participant is interested in WCE/i)
  })
})
