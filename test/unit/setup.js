import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, vi } from 'vitest'

const formatConsoleMessage = (args) =>
  args
    .map((value) => {
      if (value instanceof Error) {
        return value.stack || value.message
      }

      return typeof value === 'string' ? value : String(value)
    })
    .join(' ')

let consoleErrorSpy
let consoleWarnSpy

beforeEach(() => {
  consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation((...args) => {
    throw new Error(`Unexpected console.error: ${formatConsoleMessage(args)}`)
  })
  consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation((...args) => {
    throw new Error(`Unexpected console.warn: ${formatConsoleMessage(args)}`)
  })
})

afterEach(() => {
  consoleErrorSpy.mockRestore()
  consoleWarnSpy.mockRestore()
})
