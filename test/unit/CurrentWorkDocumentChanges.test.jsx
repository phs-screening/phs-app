import React from 'react'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { FormContext, ScrollTopContext } from '../../src/api/utils'
import Cancer365Form from '../../src/forms/Cancer365Form'
import GeriCognitive from '../../src/forms/GeriCognitiveTabs/GeriCognitive'
import MentalHealthForm from '../../src/forms/MentalHealthTabs/MentalHealthForm'
import PodiatryForm from '../../src/forms/PodiatryForm'
import { audiometryFormQuestionText } from '../../src/forms/questions/AudiometryFormQuestions'
import { podiatryFormQuestionText } from '../../src/forms/questions/PodiatryFormQuestions'
import { getMentalHealthReportAnswer } from '../../src/reports/mentalHealthReportAnswers'
import { getSavedData } from '../../src/services/patientData'
import { submitForm } from '../../src/api/formHelpers.jsx'

vi.mock('../../src/services/patientData', () => ({
  getSavedData: vi.fn(),
}))

vi.mock('../../src/api/formHelpers.jsx', () => ({
  submitForm: vi.fn(),
}))

vi.mock('../../src/components/form-components/FormSubmitStatusHost', () => ({
  showFormSubmitError: vi.fn(),
  showFormSubmitSuccess: vi.fn(),
}))

vi.mock('../../src/forms/GeriCognitiveTabs/GeriPhqForm', () => ({
  default: () => <div>PHQ form</div>,
}))

vi.mock('../../src/forms/GeriCognitiveTabs/GeriAmtForm', () => ({
  default: () => <div>AMT form</div>,
}))

const renderForm = (form) =>
  render(
    <MemoryRouter>
      <FormContext.Provider value={{ patientId: 7 }}>{form}</FormContext.Provider>
    </MemoryRouter>,
  )

describe('Current Work document station changes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getSavedData.mockResolvedValue({})
    submitForm.mockResolvedValue({ result: false, error: 'Test submission stopped' })
  })

  it('assigns stable IDs to the new Podiatry and Audiometry questions', () => {
    expect(podiatryFormQuestionText).toMatchObject({
      podiatryQ2: 'Has the participant visited the Podiatry station?',
      podiatryQ3: "Referred to Doctor's Consult?",
      podiatryQ4:
        'Please document significant findings and recommended course of action for participant:',
    })
    expect(audiometryFormQuestionText.AudiometryQ14).toBe(
      'Advised to schedule consult with Polyclinic?',
    )
  })

  it('loads the legacy Cancer365 answer into the real cancer365Q1 field', async () => {
    getSavedData.mockResolvedValue({ placeholderCompleted: 'No' })

    renderForm(<Cancer365Form />)

    expect(
      await screen.findByText('Has the patient completed the 365 Cancer Screening station?'),
    ).toBeInTheDocument()
    const question = screen.getByRole('group', { name: 'cancer365Q1' })
    expect(within(question).getByRole('radio', { name: 'No' })).toBeChecked()
  })

  it('requires Podiatry findings but accepts NIL as a documented finding', async () => {
    const user = userEvent.setup()
    renderForm(<PodiatryForm />)

    for (const questionId of ['podiatryQ2', 'podiatryQ1', 'podiatryQ3']) {
      const question = await screen.findByRole('group', { name: questionId })
      await user.click(within(question).getByRole('radio', { name: 'No' }))
    }

    await user.click(screen.getByRole('button', { name: 'Submit' }))
    expect(submitForm).not.toHaveBeenCalled()

    await user.type(screen.getByLabelText('podiatryQ4'), 'NIL')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() =>
      expect(submitForm).toHaveBeenCalledWith(
        expect.objectContaining({ podiatryQ4: 'NIL' }),
        7,
        'podiatryForm',
      ),
    )
  })

  it('loads legacy SAMH answers into NTUC fields without exposing old field IDs', async () => {
    getSavedData.mockImplementation((patientId, formName) =>
      Promise.resolve(
        formName === 'mentalHealthForm'
          ? { SAMH1: 'Yes', SAMH2: 'No', SAMH3: 'Yes' }
          : {},
      ),
    )

    renderForm(<MentalHealthForm />)

    const ntuc2 = await screen.findByRole('group', { name: 'NTUC2' })
    await waitFor(() =>
      expect(within(ntuc2).getByRole('radio', { name: 'No' })).toBeChecked(),
    )
    expect(screen.queryByRole('group', { name: 'SAMH2' })).not.toBeInTheDocument()
  })

  it('uses NTUC report answers first and falls back to legacy SAMH answers', () => {
    expect(getMentalHealthReportAnswer({ NTUC2: 'Yes' }, 2)).toBe('Yes')
    expect(getMentalHealthReportAnswer({ SAMH2: 'Yes' }, 2)).toBe('Yes')
    expect(getMentalHealthReportAnswer({ NTUC2: 'No', SAMH2: 'Yes' }, 2)).toBe('No')
  })

  it('removes the G-RACE tab from the active Geri Cognitive flow', () => {
    render(
      <ThemeProvider theme={createTheme()}>
        <ScrollTopContext.Provider value={{ scrollTop: vi.fn() }}>
          <GeriCognitive />
        </ScrollTopContext.Provider>
      </ThemeProvider>,
    )

    expect(screen.getByRole('tab', { name: 'PHQ' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'AMT' })).toBeInTheDocument()
    expect(screen.queryByRole('tab', { name: 'G-RACE' })).not.toBeInTheDocument()
  })
})
