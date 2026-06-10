const RETRYABLE_STATUSES = new Set([408, 429, 500, 502, 503, 504])

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isRetryableError(error) {
  if (!error?.status) {
    return true
  }

  return RETRYABLE_STATUSES.has(error.status)
}

export async function withRetry(fn, { retries = 2, delays = [300, 800] } = {}) {
  let lastError

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      if (attempt === retries || !isRetryableError(error)) {
        throw error
      }

      await delay(delays[attempt] ?? delays[delays.length - 1] ?? 300)
    }
  }

  throw lastError
}

export function toLoadErrorMessage(error, fallback = 'Unable to load data. Please try again.') {
  if (error?.status === 401 || error?.status === 403) {
    return 'Your session may have expired. Please log in again.'
  }

  if (error?.status === 404) {
    return 'The requested data was not found.'
  }

  return fallback
}
