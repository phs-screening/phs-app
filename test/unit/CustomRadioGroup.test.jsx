import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CustomRadioGroup from '../../src/components/form-components/CustomRadioGroup'

const options = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
]

function renderRadioGroup({ field = {}, form = {}, props = {} } = {}) {
  const mergedField = {
    name: 'consent',
    value: '',
    ...field,
  }
  const mergedForm = {
    errors: {},
    touched: {},
    submitCount: 0,
    setFieldValue: vi.fn(),
    ...form,
  }

  render(
    <CustomRadioGroup
      field={mergedField}
      form={mergedForm}
      label='Consent'
      options={options}
      {...props}
    />
  )

  return { field: mergedField, form: mergedForm }
}

describe('CustomRadioGroup', () => {
  it('renders a label and all options', () => {
    renderRadioGroup()

    expect(screen.getByText('Consent')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Yes' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'No' })).toBeInTheDocument()
  })

  it('selects the current field value', () => {
    renderRadioGroup({ field: { value: 'yes' } })

    expect(screen.getByRole('radio', { name: 'Yes' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'No' })).not.toBeChecked()
  })

  it('updates the form value when an option is selected', async () => {
    const user = userEvent.setup()
    const { form } = renderRadioGroup()

    await user.click(screen.getByRole('radio', { name: 'No' }))

    expect(form.setFieldValue).toHaveBeenCalledWith('consent', 'no')
  })

  it('shows error text after the field has been touched', () => {
    renderRadioGroup({
      form: {
        errors: { consent: 'Consent is required' },
        touched: { consent: true },
      },
    })

    expect(screen.getByText('Consent is required')).toBeInTheDocument()
  })
})
