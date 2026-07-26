import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '@mui/material/styles'
import { FormContext, ScrollTopContext } from '../../src/api/utils'
import GeriCognitiveTabs from '../../src/forms/GeriCognitiveTabs/GeriCognitive'
import customTheme from '../../src/theme'

vi.mock('../../src/forms/GeriCognitiveTabs/GeriPhqForm.jsx', () => ({
  default: () => <input aria-label='PHQ draft' />,
}))

vi.mock('../../src/forms/GeriCognitiveTabs/GeriAmtForm.jsx', () => ({
  default: () => <input aria-label='AMT draft' />,
}))

vi.mock('../../src/forms/GeriCognitiveTabs/GeriGraceForm.jsx', () => ({
  default: () => <input aria-label='G-RACE draft' />,
}))

function TestProviders({ patientId }) {
  return (
    <ThemeProvider theme={customTheme}>
      <FormContext.Provider value={{ patientId }}>
        <ScrollTopContext.Provider value={{ scrollTop: vi.fn() }}>
          <GeriCognitiveTabs />
        </ScrollTopContext.Provider>
      </FormContext.Provider>
    </ThemeProvider>
  )
}

describe('tabbed form draft persistence', () => {
  it('lazily mounts forms and retains values across tab switches', async () => {
    const user = userEvent.setup()
    render(<TestProviders patientId={7} />)

    const phqDraft = screen.getByLabelText('PHQ draft')
    expect(screen.queryByLabelText('AMT draft')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('G-RACE draft')).not.toBeInTheDocument()

    await user.type(phqDraft, 'PHQ notes')
    await user.click(screen.getByRole('tab', { name: 'AMT' }))

    expect(screen.getByLabelText('AMT draft')).toBeInTheDocument()
    expect(screen.queryByLabelText('G-RACE draft')).not.toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'PHQ' }))

    expect(screen.getByLabelText('PHQ draft')).toBe(phqDraft)
    expect(screen.getByLabelText('PHQ draft')).toHaveValue('PHQ notes')
  })

  it('discards drafts and resets lazy tabs when the patient changes', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<TestProviders patientId={7} />)

    await user.type(screen.getByLabelText('PHQ draft'), 'patient seven')
    await user.click(screen.getByRole('tab', { name: 'AMT' }))
    expect(screen.getByLabelText('AMT draft')).toBeInTheDocument()

    rerender(<TestProviders patientId={8} />)

    expect(screen.getByRole('tab', { name: 'PHQ' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByLabelText('PHQ draft')).toHaveValue('')
    expect(screen.queryByLabelText('AMT draft')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('G-RACE draft')).not.toBeInTheDocument()
  })
})
