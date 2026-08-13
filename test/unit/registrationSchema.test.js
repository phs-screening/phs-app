import { describe, expect, it } from 'vitest'
import { validationSchema } from '../../src/forms/registrationSchema'

describe('registrationSchema', () => {
  it('accepts None as a CHAS status', async () => {
    await expect(
      validationSchema.validateAt('registrationQ12', { registrationQ12: 'None' }),
    ).resolves.toBe('None')
  })

  it('does not require the removed registrationQ18 field', () => {
    expect(validationSchema.fields).not.toHaveProperty('registrationQ18')
  })
})
