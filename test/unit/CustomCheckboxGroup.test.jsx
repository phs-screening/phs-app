import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CustomCheckboxGroup from '../../src/components/form-components/CustomCheckboxGroup'

const options = [
  { value: 'fit', label: 'FIT' },
  { value: 'hpv', label: 'HPV' },
]

function renderCheckboxGroup({ form = {}, field = {}, props = {} } = {}) {
  const mergedField = {
    name: 'screenings',
    ...field,
  }
  const mergedForm = {
    errors: {},
    touched: {},
    submitCount: 0,
    values: { screenings: [] },
    setFieldValue: vi.fn(),
    ...form,
  }

  const view = render(
    <CustomCheckboxGroup
      field={mergedField}
      form={mergedForm}
      label='Screenings'
      options={options}
      {...props}
    />
  )

  return { field: mergedField, form: mergedForm, ...view }
}

describe('CustomCheckboxGroup', () => {
  it('renders a label and all options', () => {
    renderCheckboxGroup()

    expect(screen.getByText('Screenings')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'FIT' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'HPV' })).toBeInTheDocument()
  })

  it('checks options that are already in form values', () => {
    renderCheckboxGroup({
      form: {
        values: { screenings: ['fit'] },
      },
    })

    expect(screen.getByRole('checkbox', { name: 'FIT' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'HPV' })).not.toBeChecked()
  })

  it('adds an unchecked option when clicked', async () => {
    const user = userEvent.setup()
    const { form } = renderCheckboxGroup()

    await user.click(screen.getByRole('checkbox', { name: 'FIT' }))

    expect(form.setFieldValue).toHaveBeenCalledWith('screenings', ['fit'])
  })

  it('removes a checked option when clicked', async () => {
    const user = userEvent.setup()
    const { form } = renderCheckboxGroup({
      form: {
        values: { screenings: ['fit', 'hpv'] },
      },
    })

    await user.click(screen.getByRole('checkbox', { name: 'FIT' }))

    expect(form.setFieldValue).toHaveBeenCalledWith('screenings', ['hpv'])
  })

  it('shows helper text after submit attempts', () => {
    renderCheckboxGroup({
      form: {
        errors: { screenings: 'Choose at least one screening' },
        submitCount: 1,
        values: { screenings: [] },
      },
    })

    expect(screen.getByText('Choose at least one screening')).toBeInTheDocument()
  })

  it('uses row only for layout and does not forward it to checkbox inputs', () => {
    renderCheckboxGroup({ props: { row: true } })

    expect(screen.getByRole('checkbox', { name: 'FIT' })).not.toHaveAttribute('row')
    expect(screen.getByRole('checkbox', { name: 'HPV' })).not.toHaveAttribute('row')
  })
})
