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

describe('optional visual acuity fields', () => {
  it('accepts a submission without OphthalQ6 and OphthalQ7', async () => {
    await expect(ophthalValidationSchema.validate(validForm)).resolves.toEqual(validForm)
  })

  // Q4/Q5 were required when the pinhole fields were first made optional; they
  // are now optional too, with the remark fields used to explain a missing reading.
  it('accepts a submission with every acuity reading blank', async () => {
    await expect(
      ophthalValidationSchema.validate({
        ...validForm,
        OphthalQ4: '',
        OphthalQ5: '',
        OphthalQ6: '',
        OphthalQ7: '',
      }),
    ).resolves.toBeTruthy()
  })

  it('accepts optional remarks alongside a blank reading', async () => {
    await expect(
      ophthalValidationSchema.validate({
        ...validForm,
        OphthalQ4: '',
        OphthalQ4Remark: 'Unable to test, patient uncooperative',
      }),
    ).resolves.toBeTruthy()
  })

  it('formats blank and existing production values safely', () => {
    expect(formatVisualAcuity('12')).toBe('6/12')
    expect(formatVisualAcuity('')).toBe('6/___')
    expect(formatVisualAcuity(undefined)).toBe('6/___')
    expect(formatVisualAcuity(null)).toBe('6/___')
  })
})
