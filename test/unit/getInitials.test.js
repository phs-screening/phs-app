import { describe, expect, it } from 'vitest'
import getInitials from '../../src/utils/getInitials'

describe('getInitials', () => {
  it('returns an empty string for missing or empty names', () => {
    expect(getInitials()).toBe('')
    expect(getInitials('')).toBe('')
  })

  it('uses the first letter from the first two name parts', () => {
    expect(getInitials('Ada Lovelace')).toBe('AL')
    expect(getInitials('grace hopper')).toBe('GH')
    expect(getInitials('Alan Mathison Turing')).toBe('AM')
  })

  it('handles single-word names', () => {
    expect(getInitials('Madonna')).toBe('M')
  })

  it('collapses the first whitespace run between names', () => {
    expect(getInitials('Ada     Lovelace')).toBe('AL')
  })

  it('preserves the current behavior for leading whitespace', () => {
    expect(getInitials(' Ada Lovelace')).toBe('A')
  })
})
