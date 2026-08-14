import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { FormContext, ScrollTopContext } from '../../src/api/utils'
import GeriMobilityTabs from '../../src/forms/GeriMobilityTabs/GeriMobility'
import { getSavedData } from '../../src/services/patientData'
import customTheme from '../../src/theme'
import { geriPhysicalActivityLevelFormQuestionText } from '../../src/forms/questions/GeriPhysicalActivityLevelFormQuestions'
import { geriOtQuestionnaireFormQuestionText } from '../../src/forms/questions/GeriOtQuestionnaireFormQuestions'
import { geriSppbFormQuestionText } from '../../src/forms/questions/GeriSppbFormQuestions'

vi.mock('../../src/services/patientData', () => ({
  getSavedData: vi.fn(),
}))

vi.mock('../../src/forms/GeriMobilityTabs/GeriPhysicalActivityLevelForm.jsx', () => ({
  default: ({ changeTab, nextTab, onReferralSubmitted }) => (
    <button
      onClick={() => {
        onReferralSubmitted('Yes')
        changeTab(null, nextTab)
      }}
    >
      Submit Physical Yes
    </button>
  ),
}))

vi.mock('../../src/forms/GeriMobilityTabs/GeriOtQuestionnaireForm.jsx', () => ({
  default: ({ changeTab, nextTab, onReferralSubmitted }) => (
    <button
      onClick={() => {
        onReferralSubmitted('Yes')
        changeTab(null, nextTab)
      }}
    >
      Submit HOMEFAST Yes
    </button>
  ),
}))

vi.mock('../../src/forms/GeriMobilityTabs/GeriSppbForm.jsx', () => ({
  default: ({ onSubmitted }) => (
    <>
      <button onClick={() => onSubmitted({ geriSppbQ11: 'Yes' })}>Submit SPPB Yes</button>
      <button onClick={() => onSubmitted({ geriSppbQ11: 'No' })}>Submit SPPB No</button>
    </>
  ),
}))

vi.mock('../../src/forms/GeriMobilityTabs/GeriPtConsultForm.jsx', () => ({
  default: ({ onSubmitted }) => <button onClick={onSubmitted}>Submit PT Consult</button>,
}))

vi.mock('../../src/forms/GeriMobilityTabs/GeriOtConsultForm.jsx', () => ({
  default: () => <div>OT Consult Form</div>,
}))

function renderMobility() {
  return render(
    <MemoryRouter initialEntries={['/app/gerimobility']}>
      <ThemeProvider theme={customTheme}>
        <FormContext.Provider value={{ patientId: 7 }}>
          <ScrollTopContext.Provider value={{ scrollTop: vi.fn() }}>
            <Routes>
              <Route path='/app/gerimobility' element={<GeriMobilityTabs />} />
              <Route path='/app/dashboard' element={<div>Dashboard</div>} />
            </Routes>
          </ScrollTopContext.Provider>
        </FormContext.Provider>
      </ThemeProvider>
    </MemoryRouter>,
  )
}

function tabLabels() {
  return screen.getAllByRole('tab').map((tab) => tab.textContent)
}

describe('Geriatrics Mobility consult routing', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.scrollTo = vi.fn()
    getSavedData.mockResolvedValue({})
  })

  it('uses the tracker IDs and referral wording', () => {
    expect(geriPhysicalActivityLevelFormQuestionText.geriPhysicalActivityLevelQ11).toBe(
      'Refer to PT consult?',
    )
    expect(geriOtQuestionnaireFormQuestionText.geriOtQuestionnaireQ34).toBe(
      'Refer to OT consult?',
    )
    expect(geriSppbFormQuestionText.geriSppbQ11).toBe('Refer to PT consult?')
  })

  it('hides both consult tabs by default', async () => {
    renderMobility()

    await waitFor(() => expect(getSavedData).toHaveBeenCalledTimes(3))
    expect(tabLabels()).toEqual(['Physical Activity Level', 'Homefast', 'SPPB'])
  })

  it('loads PT from either saved PT referral and OT only from HOMEFAST', async () => {
    getSavedData.mockImplementation((_patientId, form) => {
      if (form === 'geriPhysicalActivityLevelForm') {
        return Promise.resolve({ geriPhysicalActivityLevelQ11: 'No' })
      }
      if (form === 'geriOtQuestionnaireForm') {
        return Promise.resolve({ geriOtQuestionnaireQ34: 'Yes' })
      }
      return Promise.resolve({ geriSppbQ11: 'Yes' })
    })
    renderMobility()

    await waitFor(() =>
      expect(tabLabels()).toEqual([
        'Physical Activity Level',
        'Homefast',
        'SPPB',
        'PT Consult',
        'OT Consult',
      ]),
    )
  })

  it('reveals tabs only after successful-form callbacks and preserves their order', async () => {
    const user = userEvent.setup()
    renderMobility()
    await waitFor(() => expect(getSavedData).toHaveBeenCalledTimes(3))

    await user.click(screen.getByRole('button', { name: 'Submit Physical Yes' }))
    expect(tabLabels()).toContain('PT Consult')

    await user.click(screen.getByRole('button', { name: 'Submit HOMEFAST Yes' }))
    expect(tabLabels().slice(-2)).toEqual(['PT Consult', 'OT Consult'])
  })

  it('skips PT and opens OT when only HOMEFAST refers the patient', async () => {
    const user = userEvent.setup()
    getSavedData.mockImplementation((_patientId, form) =>
      Promise.resolve(
        form === 'geriOtQuestionnaireForm' ? { geriOtQuestionnaireQ34: 'Yes' } : {},
      ),
    )
    renderMobility()

    await waitFor(() => expect(tabLabels()).toContain('OT Consult'))
    await user.click(screen.getByRole('tab', { name: 'SPPB' }))
    await user.click(screen.getByRole('button', { name: 'Submit SPPB No' }))

    expect(await screen.findByText('OT Consult Form')).toBeInTheDocument()
    expect(tabLabels()).not.toContain('PT Consult')
  })

  it('returns to the dashboard after SPPB when there is no referral', async () => {
    const user = userEvent.setup()
    renderMobility()

    await waitFor(() => expect(getSavedData).toHaveBeenCalledTimes(3))
    await user.click(screen.getByRole('tab', { name: 'SPPB' }))
    await user.click(screen.getByRole('button', { name: 'Submit SPPB No' }))

    expect(await screen.findByText('Dashboard')).toBeInTheDocument()
  })
})
