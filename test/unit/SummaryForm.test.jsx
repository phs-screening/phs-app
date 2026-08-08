import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SummaryForm from '../../src/forms/SummaryForm'
import { getSummaryReportDataStrict } from '../../src/services/patientData'
import { generate_pdf_updated } from '../../src/reports/patientReportPdfUpdated'
import { createDeferred, renderFormWithContext } from '../utils/formTestHarness'

vi.mock('../../src/services/patientData', () => ({
  getSummaryReportDataStrict: vi.fn(),
}))
vi.mock('../../src/reports/patientReportPdfUpdated', () => ({
  generate_pdf_updated: vi.fn(),
}))

const reportData = {
  registration: { registrationQ2: 'AL' },
  patients: { queueNo: 7 },
  cancer: { cancerQ1: 'No' },
  triage: { triageQ15: 38 },
  hxOsa: { OSA1: 'No' },
}

describe('SummaryForm report lifecycle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getSummaryReportDataStrict.mockResolvedValue(reportData)
    generate_pdf_updated.mockResolvedValue(undefined)
  })

  it('loads aggregate data and passes each mapped section to the report generator', async () => {
    const user = userEvent.setup()
    renderFormWithContext(<SummaryForm />)

    await user.click(await screen.findByRole('button', { name: 'Download Screening Report' }))

    await waitFor(() => expect(generate_pdf_updated).toHaveBeenCalledTimes(1))
    const reportArguments = generate_pdf_updated.mock.calls[0]
    expect(reportArguments).toHaveLength(29)
    expect(reportArguments[0]).toEqual(reportData.registration)
    expect(reportArguments[1]).toEqual(reportData.patients)
    expect(reportArguments[2]).toEqual(reportData.cancer)
    expect(reportArguments[13]).toEqual(reportData.triage)
    expect(reportArguments[28]).toEqual(reportData.hxOsa)
  })

  it('disables repeat generation until the current report finishes', async () => {
    const generation = createDeferred()
    generate_pdf_updated.mockReturnValue(generation.promise)
    const user = userEvent.setup()
    renderFormWithContext(<SummaryForm />)

    await user.click(await screen.findByRole('button', { name: 'Download Screening Report' }))
    const pendingButton = screen.getByRole('button', { name: 'Generating Report...' })
    expect(pendingButton).toBeDisabled()
    expect(generate_pdf_updated).toHaveBeenCalledTimes(1)

    generation.resolve()
    expect(
      await screen.findByRole('button', { name: 'Download Screening Report' }),
    ).toBeEnabled()
  })

  it('shows report errors, retains loaded data, and allows another attempt', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    generate_pdf_updated
      .mockRejectedValueOnce(new Error('PDF unavailable'))
      .mockResolvedValueOnce(undefined)
    const user = userEvent.setup()
    renderFormWithContext(<SummaryForm />)

    await user.click(await screen.findByRole('button', { name: 'Download Screening Report' }))
    expect(await screen.findByText(/PDF unavailable/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Download Screening Report' }))
    await waitFor(() => expect(generate_pdf_updated).toHaveBeenCalledTimes(2))
    expect(getSummaryReportDataStrict).toHaveBeenCalledTimes(1)
  })

  it('retries aggregate loading after a visible failure', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    getSummaryReportDataStrict
      .mockRejectedValueOnce(new Error('summary unavailable'))
      .mockResolvedValueOnce(reportData)
    const user = userEvent.setup()
    renderFormWithContext(<SummaryForm />)

    expect(await screen.findByText(/summary unavailable/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Try Again' }))
    expect(
      await screen.findByRole('button', { name: 'Download Screening Report' }),
    ).toBeEnabled()
    expect(getSummaryReportDataStrict).toHaveBeenCalledTimes(2)
  })
})
