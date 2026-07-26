import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { FormContext, ScrollTopContext } from '../../src/api/utils'
import HxTabs from '../../src/forms/HistoryTakingTabs/HistoryTaking'
import HxHcsrForm from '../../src/forms/HistoryTakingTabs/HxHcsrForm'
import HxFamilyForm from '../../src/forms/HistoryTakingTabs/HxFamilyForm'
import HxGynaeForm from '../../src/forms/HistoryTakingTabs/HxGynaeForm'
import HxNssForm from '../../src/forms/HistoryTakingTabs/HxNssForm'
import HxOsaForm from '../../src/forms/HistoryTakingTabs/HxOsaForm'
import HxOralForm from '../../src/forms/HistoryTakingTabs/HxOralForm'
import HxSocialForm from '../../src/forms/HistoryTakingTabs/HxSocialForm'
import { getSavedData } from '../../src/services/patientData'
import { submitForm } from '../../src/api/formHelpers.jsx'
import customTheme from '../../src/theme'

vi.mock('../../src/api/formHelpers.jsx', () => ({
  submitForm: vi.fn(),
}))

vi.mock('src/components/form-components/FormSubmitStatusHost', () => ({
  showFormSubmitError: vi.fn(),
  showFormSubmitSuccess: vi.fn(),
}))

vi.mock('../../src/services/patientData', () => ({
  getSavedData: vi.fn(),
}))

function renderHistoryForm(form) {
  return render(<FormContext.Provider value={{ patientId: 7 }}>{form}</FormContext.Provider>)
}

function mockHistoryData(age, pmhx = {}) {
  getSavedData.mockImplementation((_patientId, requestedForm) =>
    Promise.resolve(requestedForm === 'registrationForm' ? { registrationQ4: age } : pmhx),
  )
}

describe('history-taking forms', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getSavedData.mockResolvedValue({})
    submitForm.mockResolvedValue({ result: true })
  })

  it('uses a full-name prompt and removes HCSR Q4 and Q6', () => {
    renderHistoryForm(<HxHcsrForm changeTab={vi.fn()} nextTab={1} />)

    expect(screen.getByText("Please enter History-taker's full name")).toBeInTheDocument()
    expect(screen.queryByLabelText('hxHcsrQ4')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('hxHcsrQ6')).not.toBeInTheDocument()
  })

  it('removes obsolete PMHX fields and updates PMHX6 wording', () => {
    renderHistoryForm(<HxNssForm changeTab={vi.fn()} nextTab={1} />)

    expect(screen.getByText('Do you go for regular health screenings?')).toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', {
        name: 'Others (e.g. Fatty liver / respiratory / kidney problems)',
      }),
    ).toBeInTheDocument()
    expect(screen.queryByLabelText('PMHX2')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('PMHX3')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('PMHX4')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('PMHX10')).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/PMHXShortAns5/)).not.toBeInTheDocument()
  })

  it('shows OSA immediately after scoliosis and before M4/M5 review', () => {
    window.scrollTo = vi.fn()
    render(
      <ThemeProvider theme={customTheme}>
        <FormContext.Provider value={{ patientId: 7 }}>
          <ScrollTopContext.Provider value={{ scrollTop: vi.fn() }}>
            <HxTabs />
          </ScrollTopContext.Provider>
        </FormContext.Provider>
      </ThemeProvider>,
    )

    const tabLabels = screen.getAllByRole('tab').map((tab) => tab.textContent)
    expect(tabLabels.indexOf('OSA')).toBe(tabLabels.indexOf('SCOL') + 1)
    expect(tabLabels.indexOf('OSA')).toBeLessThan(tabLabels.indexOf('M4/M5 Review'))
  })

  it('shows and requires all four OSA questions', async () => {
    const user = userEvent.setup()
    renderHistoryForm(
      <MemoryRouter>
        <HxOsaForm changeTab={vi.fn()} nextTab={1} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Obstructive Sleep Apnea (for research)')).toBeInTheDocument()
    expect(
      screen.getByText(
        'OSA1 - Do you snore loudly? (Louder than talking or loud enough to be heard through closed doors)',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'OSA2 - Do you often feel tired, fatigued, or sleepy during the daytime?',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByText('OSA3 - Has anyone observed you stop breathing during sleep?'),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'OSA4 - Do you have (or are you being treated for) high blood pressure?',
      ),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(await screen.findAllByText('Required')).toHaveLength(4)
    expect(submitForm).not.toHaveBeenCalled()
  })

  it('updates the Social History diet and alcohol guidance and removes obsolete fields', () => {
    renderHistoryForm(<HxSocialForm changeTab={vi.fn()} nextTab={1} />)

    expect(screen.getByText('Do you think you eat a balanced diet?')).toBeInTheDocument()
    expect(screen.getByText('1 can (330 ml) of regular beer at 5% alcohol')).toBeInTheDocument()
    expect(screen.queryByLabelText('SOCIAL13A')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('SOCIAL13B')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('SOCIAL13C')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('SOCIAL16')).not.toBeInTheDocument()
  })

  it('limits ORAL1 to Healthy or Poor and removes ORALShortAns1', () => {
    renderHistoryForm(<HxOralForm changeTab={vi.fn()} nextTab={1} />)

    expect(
      screen.getByRole('table', { name: 'Oral health quick inspection guide' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Emergency Indications')).toBeInTheDocument()
    expect(screen.getByText('OMS (Oral and Maxillofacial Surgery)')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Healthy' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Poor' })).toBeInTheDocument()
    expect(screen.queryByRole('radio', { name: 'Moderate' })).not.toBeInTheDocument()
    expect(screen.queryByLabelText('ORALShortAns1')).not.toBeInTheDocument()
  })

  it('updates FAMILY1 wording and removes FAMILY2', () => {
    renderHistoryForm(<HxFamilyForm changeTab={vi.fn()} nextTab={1} />)

    expect(
      screen.getByText('Does the patient have any relevant family history?'),
    ).toBeInTheDocument()
    expect(screen.queryByLabelText('FAMILY2')).not.toBeInTheDocument()
  })

  it('uses the 1–8 August 2026 menstrual-period window for GYNAE16', () => {
    renderHistoryForm(<HxGynaeForm changeTab={vi.fn()} nextTab={1} />)

    expect(
      screen.getByText(
        /Was your last menstrual period within the window where the first day falls between 1 Aug 2026 and 8 Aug 2026?/,
      ),
    ).toBeInTheDocument()
  })

  it.each([
    { age: 59, pneumococcal: false, shingles: false },
    { age: 60, pneumococcal: false, shingles: true },
    { age: 64, pneumococcal: false, shingles: true },
    { age: 65, pneumococcal: true, shingles: true },
  ])(
    'applies vaccination age gates when the patient is $age',
    async ({ age, pneumococcal, shingles }) => {
      mockHistoryData(age)
      renderHistoryForm(<HxNssForm changeTab={vi.fn()} nextTab={1} />)

      await waitFor(() => expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled())

      expect(
        screen.getByText('Have you received the influenza vaccine in the last year?'),
      ).toBeInTheDocument()
      expect(screen.queryByText('Have you received the pneumococcal vaccine?') !== null).toBe(
        pneumococcal,
      )
      expect(screen.queryByText('Have you received the shingles vaccine?') !== null).toBe(shingles)
    },
  )

  it('shows and requires interest questions after a No or Unsure answer', async () => {
    const user = userEvent.setup()
    mockHistoryData(59, {
      PMHX1: 'None',
      PMHX6: 'Yes',
      PMHX7: 'No',
      PMHXVAX1: 'No',
    })
    renderHistoryForm(<HxNssForm changeTab={vi.fn()} nextTab={1} />)

    await waitFor(() => expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled())
    expect(screen.getByText('PMHXVAX2')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(await screen.findByText('Required')).toBeInTheDocument()
    expect(submitForm).not.toHaveBeenCalled()
  })

  it('clears vaccination interest answers that are no longer applicable', async () => {
    const user = userEvent.setup()
    mockHistoryData(65, {
      PMHX1: 'None',
      PMHX6: 'Yes',
      PMHX7: 'No',
      PMHXVAX1: 'Yes',
      PMHXVAX2: 'Yes',
      PMHXVAX3: 'Yes',
      PMHXVAX4: 'Unsure',
      PMHXVAX5: 'Yes',
      PMHXVAX6: 'No',
    })
    renderHistoryForm(<HxNssForm changeTab={vi.fn()} nextTab={1} />)

    await waitFor(() => expect(screen.getByRole('button', { name: 'Submit' })).toBeEnabled())
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() =>
      expect(submitForm).toHaveBeenCalledWith(
        expect.objectContaining({
          PMHXVAX2: '',
          PMHXVAX4: '',
          PMHXVAX6: '',
        }),
        7,
        'hxNssForm',
      ),
    )
  })
})
