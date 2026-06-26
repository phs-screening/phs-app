import { describe, expect, it, vi } from 'vitest'
import { toLoadErrorMessage, withRetry } from '../../src/utils/retryRequest'

describe('retryRequest', () => {
  describe('withRetry', () => {
    it('returns the result from a successful call', async () => {
      const fn = vi.fn().mockResolvedValue('loaded')

      await expect(withRetry(fn)).resolves.toBe('loaded')

      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('retries retryable status errors before succeeding', async () => {
      const fn = vi
        .fn()
        .mockRejectedValueOnce({ status: 503 })
        .mockResolvedValueOnce('loaded')

      await expect(withRetry(fn, { retries: 2, delays: [0] })).resolves.toBe('loaded')

      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('retries errors without a status before succeeding', async () => {
      const fn = vi.fn().mockRejectedValueOnce(new Error('Network down')).mockResolvedValueOnce('loaded')

      await expect(withRetry(fn, { retries: 1, delays: [0] })).resolves.toBe('loaded')

      expect(fn).toHaveBeenCalledTimes(2)
    })

    it('does not retry non-retryable status errors', async () => {
      const error = { status: 400 }
      const fn = vi.fn().mockRejectedValue(error)

      await expect(withRetry(fn, { retries: 2, delays: [0] })).rejects.toBe(error)

      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('throws the last error after retries are exhausted', async () => {
      const firstError = { status: 503, message: 'first' }
      const secondError = { status: 504, message: 'second' }
      const fn = vi.fn().mockRejectedValueOnce(firstError).mockRejectedValueOnce(secondError)

      await expect(withRetry(fn, { retries: 1, delays: [0] })).rejects.toBe(secondError)

      expect(fn).toHaveBeenCalledTimes(2)
    })
  })

  describe('toLoadErrorMessage', () => {
    it('returns the session message for unauthorized errors', () => {
      expect(toLoadErrorMessage({ status: 401 })).toBe(
        'Your session may have expired. Please log in again.'
      )
      expect(toLoadErrorMessage({ status: 403 })).toBe(
        'Your session may have expired. Please log in again.'
      )
    })

    it('returns the not found message for 404 errors', () => {
      expect(toLoadErrorMessage({ status: 404 })).toBe('The requested data was not found.')
    })

    it('returns the fallback message for other errors', () => {
      expect(toLoadErrorMessage({ status: 500 }, 'Try again later.')).toBe('Try again later.')
      expect(toLoadErrorMessage(null)).toBe('Unable to load data. Please try again.')
    })
  })
})
