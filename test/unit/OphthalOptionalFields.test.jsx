import { describe, expect, it } from 'vitest'

import { ophthalValidationSchema } from '../../src/forms/OphthalForm'
import { formatVisualAcuity } from '../../src/utils/visualAcuity'

const validForm = {
  OphthalQ1: 'No',
  OphthalQ2: 'NIL',
  OphthalQ3: '',
  OphthalQ4: '6',
  OphthalQ5: '6',
  OphthalQ6: '',
  OphthalQ7: '',
  OphthalQ8: 'No',
  OphthalQ9: '',
  OphthalQ10: 'None',
  OphthalQ11: [],
  OphthalQ12: 'No',
  OphthalQ13: 'No',
}

describe('optional pinhole visual acuity fields', () => {
  it('accepts a submission without OphthalQ6 and OphthalQ7', async () => {
    await expect(ophthalValidationSchema.validate(validForm)).resolves.toEqual(validForm)
  })

  it('continues to require visual acuity without pinhole', async () => {
    await expect(
      ophthalValidationSchema.validate({ ...validForm, OphthalQ4: '' }),
    ).rejects.toThrow()
  })

  it('formats blank and existing production values safely', () => {
    expect(formatVisualAcuity('12')).toBe('6/12')
    expect(formatVisualAcuity('')).toBe('6/___')
    expect(formatVisualAcuity(undefined)).toBe('6/___')
    expect(formatVisualAcuity(null)).toBe('6/___')
  })
})
