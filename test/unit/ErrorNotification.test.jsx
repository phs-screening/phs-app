import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useFormikContext } from 'formik'
import ErrorNotification from '../../src/components/form-components/ErrorNotification'

vi.mock('formik', () => ({
  useFormikContext: vi.fn(),
}))

describe('ErrorNotification', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useFormikContext.mockReturnValue({ errors: {} })
  })

  it('renders nothing when show is false', () => {
    render(<ErrorNotification />)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('renders the default message when shown', () => {
    render(<ErrorNotification show />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Please fill in all required fields correctly.'
    )
  })

  it('renders a custom message and severity', () => {
    render(<ErrorNotification show message='Please review this section.' severity='warning' />)

    expect(screen.getByRole('alert')).toHaveTextContent('Please review this section.')
  })

  it('flattens nested object errors passed directly by props', () => {
    render(
      <ErrorNotification
        show
        errors={{
          registration: {
            initials: 'Required',
            age: 'Must be at least 18',
          },
        }}
      />
    )

    expect(screen.getByText('registration.initials: Required')).toBeInTheDocument()
    expect(screen.getByText('Must be at least 18')).toBeInTheDocument()
  })

  it('flattens array errors', () => {
    render(
      <ErrorNotification
        show
        errors={{
          medications: [{ name: 'Required' }, { dose: 'Invalid dose' }],
        }}
      />
    )

    expect(screen.getByText('medications.0.name: Required')).toBeInTheDocument()
    expect(screen.getByText('Invalid dose')).toBeInTheDocument()
  })

  it('uses Formik context errors when explicit errors are not supplied', () => {
    useFormikContext.mockReturnValue({
      errors: {
        patient: {
          name: 'This field is required',
        },
      },
    })

    render(<ErrorNotification show />)

    expect(screen.getByText('patient.name: This field is required')).toBeInTheDocument()
  })
})
