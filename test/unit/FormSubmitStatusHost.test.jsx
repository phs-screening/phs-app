import React from 'react'
import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import FormSubmitStatusHost, {
  FORM_SUBMIT_ERROR_HIDE_MS,
  FORM_SUBMIT_STATUS_EVENT,
  FORM_SUBMIT_STATUS_RELEASE_EVENT,
  FORM_SUBMIT_SUCCESS_FALLBACK_HIDE_MS,
  showFormSubmitError,
  showFormSubmitSuccess,
} from '../../src/components/form-components/FormSubmitStatusHost'

function renderHost() {
  return render(
    <MemoryRouter>
      <FormSubmitStatusHost />
    </MemoryRouter>
  )
}

describe('FormSubmitStatusHost helpers', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('dispatches a success status event and then a release event', async () => {
    const statusListener = vi.fn()
    const releaseListener = vi.fn()
    window.addEventListener(FORM_SUBMIT_STATUS_EVENT, statusListener)
    window.addEventListener(FORM_SUBMIT_STATUS_RELEASE_EVENT, releaseListener)

    const promise = showFormSubmitSuccess({
      message: 'Saved. Redirecting...',
      redirectDelayMs: 50,
    })

    expect(statusListener).toHaveBeenCalledTimes(1)
    expect(statusListener.mock.calls[0][0].detail).toEqual({
      autoHideDuration: FORM_SUBMIT_SUCCESS_FALLBACK_HIDE_MS,
      blocking: true,
      message: 'Saved. Redirecting...',
      redirecting: true,
      severity: 'success',
    })

    await act(async () => {
      vi.advanceTimersByTime(50)
      await promise
    })

    expect(releaseListener).toHaveBeenCalledTimes(1)

    window.removeEventListener(FORM_SUBMIT_STATUS_EVENT, statusListener)
    window.removeEventListener(FORM_SUBMIT_STATUS_RELEASE_EVENT, releaseListener)
  })

  it('dispatches an error status event', () => {
    const statusListener = vi.fn()
    window.addEventListener(FORM_SUBMIT_STATUS_EVENT, statusListener)

    showFormSubmitError('Unable to save form.')

    expect(statusListener).toHaveBeenCalledTimes(1)
    expect(statusListener.mock.calls[0][0].detail).toEqual({
      autoHideDuration: FORM_SUBMIT_ERROR_HIDE_MS,
      blocking: false,
      message: 'Unable to save form.',
      redirecting: false,
      severity: 'error',
    })

    window.removeEventListener(FORM_SUBMIT_STATUS_EVENT, statusListener)
  })
})

describe('FormSubmitStatusHost', () => {
  it('renders a submitted status message from a window event', async () => {
    renderHost()

    act(() => {
      window.dispatchEvent(
        new CustomEvent(FORM_SUBMIT_STATUS_EVENT, {
          detail: {
            message: 'Form saved.',
            severity: 'success',
          },
        })
      )
    })

    expect(await screen.findByText('Form saved.')).toBeInTheDocument()
  })

  it('hides a status message when the release event is dispatched', async () => {
    renderHost()

    act(() => {
      window.dispatchEvent(
        new CustomEvent(FORM_SUBMIT_STATUS_EVENT, {
          detail: {
            message: 'Saving form...',
            blocking: true,
            severity: 'success',
          },
        })
      )
    })

    expect(await screen.findByText('Saving form...')).toBeInTheDocument()

    act(() => {
      window.dispatchEvent(new CustomEvent(FORM_SUBMIT_STATUS_RELEASE_EVENT))
    })

    await waitFor(() => {
      expect(screen.queryByText('Saving form...')).not.toBeInTheDocument()
    })
  })
})
