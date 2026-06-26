import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import CustomCheckbox from '../../src/components/form-components/CustomCheckbox'

function renderCheckbox({ field = {}, form = {}, props = {} } = {}) {
  const mergedField = {
    name: 'agreed',
    value: false,
    onChange: vi.fn(),
    onBlur: vi.fn(),
    ...field,
  }
  const mergedForm = {
    errors: {},
    touched: {},
    submitCount: 0,
    ...form,
  }

  render(
    <CustomCheckbox
      field={mergedField}
      form={mergedForm}
      label='I agree'
      {...props}
    />
  )

  return { field: mergedField, form: mergedForm }
}

describe('CustomCheckbox', () => {
  it('renders the checkbox label', () => {
    renderCheckbox()

    expect(screen.getByRole('checkbox', { name: 'I agree' })).toBeInTheDocument()
  })

  it('uses the boolean value of the field as checked state', () => {
    const { rerender } = render(
      <CustomCheckbox
        field={{ name: 'agreed', value: '', onChange: vi.fn(), onBlur: vi.fn() }}
        form={{ errors: {}, touched: {}, submitCount: 0 }}
        label='I agree'
      />
    )

    expect(screen.getByRole('checkbox', { name: 'I agree' })).not.toBeChecked()

    rerender(
      <CustomCheckbox
        field={{ name: 'agreed', value: 'yes', onChange: vi.fn(), onBlur: vi.fn() }}
        form={{ errors: {}, touched: {}, submitCount: 0 }}
        label='I agree'
      />
    )

    expect(screen.getByRole('checkbox', { name: 'I agree' })).toBeChecked()
  })

  it('shows helper text after the field has been touched', () => {
    renderCheckbox({
      form: {
        errors: { agreed: 'Agreement is required' },
        touched: { agreed: true },
      },
    })

    expect(screen.getByText('Agreement is required')).toBeInTheDocument()
  })

  it('shows helper text after submit attempts', () => {
    renderCheckbox({
      form: {
        errors: { agreed: 'Agreement is required' },
        submitCount: 1,
      },
    })

    expect(screen.getByText('Agreement is required')).toBeInTheDocument()
  })
})
