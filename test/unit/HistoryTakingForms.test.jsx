import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { FormContext, ScrollTopContext } from '../../src/api/utils'
import HxTabs from '../../src/forms/HistoryTakingTabs/HistoryTaking'
import HxHcsrForm from '../../src/forms/HistoryTakingTabs/HxHcsrForm'
import HxHcsrReviewForm from '../../src/forms/HistoryTakingTabs/HxHcsrReviewForm'
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
    expect(screen.queryByLabelText('hxHcsrQ7')).not.toBeInTheDocument()
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
    expect(screen.queryByLabelText('PMHX7')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('PMHXShortAns7')).not.toBeInTheDocument()
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
    expect(tabLabels.indexOf('OSA')).toBe(tabLabels.indexOf('Scoliosis') + 1)
    expect(tabLabels.indexOf('HCSR Review')).toBe(tabLabels.indexOf('OSA') + 1)
    expect(tabLabels.indexOf('M4/M5 Review')).toBe(tabLabels.indexOf('HCSR Review') + 1)
  })

  it('moves HCSR Q7 to its own form and preloads legacy answers', async () => {
    getSavedData.mockImplementation((_patientId, requestedForm) =>
      Promise.resolve(
        requestedForm === 'hxHcsrForm'
          ? { hxHcsrQ7: 'Yes', hxHcsrShortAnsQ7: 'Legacy reason' }
          : {},
      ),
    )
    renderHistoryForm(<HxHcsrReviewForm changeTab={vi.fn()} nextTab={1} />)

    expect(await screen.findByText('HEALTH CONCERNS REVIEW')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByRole('radio', { name: 'Yes' })).toBeChecked())
    expect(screen.getByDisplayValue('Legacy reason')).toBeInTheDocument()
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

    // SOCIAL11 duplicated the structured SOCIAL10 smoking history; SOCIAL14 was dropped.
    expect(screen.queryByLabelText('SOCIAL11')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('SOCIALShortAns11')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('SOCIAL14')).not.toBeInTheDocument()

    // SOCIAL12 is now Yes/No, with the amount asked only when the answer is Yes.
    expect(screen.getByText('Do you consume alcoholic drinks?')).toBeInTheDocument()
    expect(screen.queryByLabelText('SOCIALShortAns12')).not.toBeInTheDocument()
  })

  it('limits ORAL1 to Healthy or Poor and removes ORALShortAns1', () => {
    renderHistoryForm(<HxOralForm changeTab={vi.fn()} nextTab={1} />)

    // The emergency indications and inspection guide are now only shown via the
    // dentistry_check.png reference image, which duplicated both verbatim.
    expect(
      screen.queryByRole('table', { name: 'Oral health quick inspection guide' }),
    ).not.toBeInTheDocument()
    expect(screen.queryByText('Emergency Indications')).not.toBeInTheDocument()
    expect(screen.queryByText('OMS (Oral and Maxillofacial Surgery)')).not.toBeInTheDocument()
    expect(screen.getByAltText('Reference list of dental concerns')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Healthy' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Poor' })).toBeInTheDocument()
    expect(screen.queryByRole('radio', { name: 'Moderate' })).not.toBeInTheDocument()
    expect(screen.queryByLabelText('ORALShortAns1')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('ORAL2')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('ORAL4')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('ORAL5')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('ORALShortAns5')).not.toBeInTheDocument()
  })

  it('updates FAMILY1 wording and removes FAMILY2', () => {
    renderHistoryForm(<HxFamilyForm changeTab={vi.fn()} nextTab={1} />)

    expect(
      screen.getByText('Does the patient have any relevant family history?'),
    ).toBeInTheDocument()
    expect(screen.queryByLabelText('FAMILY2')).not.toBeInTheDocument()
  })

  it('asks GYNAE17 first and only reveals the rest once the answer is Yes', async () => {
    const user = userEvent.setup()
    renderHistoryForm(<HxGynaeForm changeTab={vi.fn()} nextTab={1} />)

    expect(screen.getByText('Indicated interest for HPV Test under SCS?')).toBeInTheDocument()
    expect(
      screen.queryByText(
        /Was your last menstrual period within the window where the first day falls between 1 Aug 2026 and 8 Aug 2026?/,
      ),
    ).not.toBeInTheDocument()

    await user.click(screen.getAllByRole('radio', { name: 'Yes' })[0])

    expect(
      await screen.findByText(
        'Is patient indicated for on-site testing? Please circle On-Site Testing on Form A as well',
      ),
    ).toBeInTheDocument()
    expect(screen.queryByLabelText('GYNAE16')).not.toBeInTheDocument()
  })

  it('defaults removed GYNAE16 to Yes even when legacy saved data contains No', async () => {
    const user = userEvent.setup()
    getSavedData.mockResolvedValue({
      GYNAE12: 'Never before',
      GYNAE13: 'Never before',
      GYNAE14: 'Yes',
      GYNAE15: 'No',
      GYNAE16: 'No',
      GYNAE17: 'Yes',
      GYNAE18: 'Yes',
    })
    renderHistoryForm(<HxGynaeForm changeTab={vi.fn()} nextTab={1} />)

    await waitFor(() =>
      expect(
        screen.getAllByRole('radio', { name: 'Never before' }).every((radio) => radio.checked),
      ).toBe(true),
    )
    expect(screen.queryByLabelText('GYNAE16')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() =>
      expect(submitForm).toHaveBeenCalledWith(
        expect.objectContaining({ GYNAE16: 'Yes' }),
        7,
        'gynaeForm',
      ),
    )
  })

  it('submits the GYNAE16 compatibility value when HPV testing is declined', async () => {
    const user = userEvent.setup()
    renderHistoryForm(<HxGynaeForm changeTab={vi.fn()} nextTab={1} />)

    await user.click(screen.getByRole('radio', { name: 'No' }))
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() =>
      expect(submitForm).toHaveBeenCalledWith(
        expect.objectContaining({
          GYNAE12: '',
          GYNAE16: 'Yes',
          GYNAE18: '',
        }),
        7,
        'gynaeForm',
      ),
    )
  })

  it('drops the Not answered and Not Applicable options from the gynae form', () => {
    renderHistoryForm(<HxGynaeForm changeTab={vi.fn()} nextTab={1} />)

    expect(screen.queryByRole('radio', { name: 'Not answered' })).not.toBeInTheDocument()
    expect(screen.queryByRole('radio', { name: 'Not Applicable' })).not.toBeInTheDocument()
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
