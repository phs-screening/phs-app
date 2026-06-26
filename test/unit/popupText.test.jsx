import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useFormikContext } from 'formik'
import PopupText from '../../src/utils/popupText'

vi.mock('formik', () => ({
  useFormikContext: vi.fn(),
}))

describe('PopupText', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useFormikContext.mockReturnValue({ values: {} })
  })

  it('renders children when the form value matches the trigger value', () => {
    useFormikContext.mockReturnValue({ values: { registrationQ1: 'Yes' } })

    render(
      <PopupText qnNo='registrationQ1' triggerValue='Yes'>
        Matching content
      </PopupText>
    )

    expect(screen.getByText('Matching content')).toBeInTheDocument()
  })

  it('renders nothing when the form value does not match the trigger value', () => {
    useFormikContext.mockReturnValue({ values: { registrationQ1: 'No' } })

    render(
      <PopupText qnNo='registrationQ1' triggerValue='Yes'>
        Matching content
      </PopupText>
    )

    expect(screen.queryByText('Matching content')).not.toBeInTheDocument()
  })

  it('supports an array of trigger values', () => {
    useFormikContext.mockReturnValue({ values: { screening: 'hpv' } })

    render(
      <PopupText qnNo='screening' triggerValue={['fit', 'hpv']}>
        Follow-up content
      </PopupText>
    )

    expect(screen.getByText('Follow-up content')).toBeInTheDocument()
  })

  it('uses a condition function when supplied', () => {
    useFormikContext.mockReturnValue({ values: { age: 65 } })
    const condition = vi.fn((age) => age >= 60)

    render(
      <PopupText qnNo='age' triggerValue={30} condition={condition}>
        Senior content
      </PopupText>
    )

    expect(condition).toHaveBeenCalledWith(65)
    expect(screen.getByText('Senior content')).toBeInTheDocument()
  })

  it('lets condition take priority over triggerValue', () => {
    useFormikContext.mockReturnValue({ values: { age: 65 } })

    render(
      <PopupText qnNo='age' triggerValue={65} condition={() => false}>
        Senior content
      </PopupText>
    )

    expect(screen.queryByText('Senior content')).not.toBeInTheDocument()
  })

  it('handles missing form values safely', () => {
    useFormikContext.mockReturnValue({ values: {} })

    render(
      <PopupText qnNo='missingQuestion' triggerValue='Yes'>
        Missing value content
      </PopupText>
    )

    expect(screen.queryByText('Missing value content')).not.toBeInTheDocument()
  })
})
