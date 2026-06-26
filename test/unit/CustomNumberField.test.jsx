import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import CustomNumberField from '../../src/components/form-components/CustomNumberField'

function renderNumberField({ field = {}, form = {}, props = {} } = {}) {
  const mergedField = {
    name: 'height',
    value: '',
    onBlur: vi.fn(),
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
    <CustomNumberField
      field={mergedField}
      form={mergedForm}
      label='Height'
      {...props}
    />
  )

  return { field: mergedField, form: mergedForm }
}

describe('CustomNumberField', () => {
  it('renders a number input with decimal-friendly input props', () => {
    renderNumberField()

    const input = screen.getByLabelText('Height')

    expect(input).toHaveAttribute('type', 'number')
    expect(input).toHaveAttribute('inputmode', 'decimal')
    expect(input).toHaveAttribute('pattern', '[0-9]*')
  })

  it('stores valid numeric input as a number', () => {
    const { form } = renderNumberField()

    fireEvent.change(screen.getByLabelText('Height'), { target: { value: '172.5' } })

    expect(form.setFieldValue).toHaveBeenCalledWith('height', 172.5)
  })

  it('stores empty input as an empty string', () => {
    const { form } = renderNumberField({ field: { value: 172 } })

    fireEvent.change(screen.getByLabelText('Height'), { target: { value: '' } })

    expect(form.setFieldValue).toHaveBeenCalledWith('height', '')
  })

  it('ignores invalid decimal input', () => {
    const { form } = renderNumberField()

    fireEvent.change(screen.getByLabelText('Height'), { target: { value: '12..3' } })

    expect(form.setFieldValue).not.toHaveBeenCalled()
  })

  it('prevents non-numeric key presses', () => {
    renderNumberField()

    const wasNotPrevented = fireEvent.keyDown(screen.getByLabelText('Height'), {
      key: 'e',
    })

    expect(wasNotPrevented).toBe(false)
  })

  it('prevents a second decimal point', () => {
    renderNumberField({ field: { value: '1.2' } })

    const wasNotPrevented = fireEvent.keyDown(screen.getByLabelText('Height'), {
      key: '.',
    })

    expect(wasNotPrevented).toBe(false)
  })

  it('shows helper text after the field has been touched', () => {
    renderNumberField({
      form: {
        errors: { height: 'Height is required' },
        touched: { height: true },
      },
    })

    expect(screen.getByText('Height is required')).toBeInTheDocument()
  })
})
