import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DataLoadError from '../../src/components/DataLoadError'

describe('DataLoadError', () => {
  it('renders the default error message', () => {
    render(<DataLoadError />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Unable to load data. Refresh or try again.'
    )
  })

  it('renders a custom error message', () => {
    render(<DataLoadError message='Patients could not be loaded.' />)

    expect(screen.getByRole('alert')).toHaveTextContent('Patients could not be loaded.')
  })

  it('does not render a retry button when no retry handler is supplied', () => {
    render(<DataLoadError />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('calls the retry handler when the retry button is clicked', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()

    render(<DataLoadError onRetry={onRetry} retryLabel='Reload patients' />)
    await user.click(screen.getByRole('button', { name: 'Reload patients' }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
