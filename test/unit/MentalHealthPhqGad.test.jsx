import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormContext } from '../../src/api/utils'
import HxPhqForm from '../../src/forms/HistoryTakingTabs/HxPhqForm'
import MentalHealthPHQ from '../../src/forms/MentalHealthTabs/MentalHealthPHQ'
import { getSavedData } from '../../src/services/patientData'
import { submitForm } from '../../src/api/formHelpers.jsx'

vi.mock('../../src/api/formHelpers.jsx', () => ({ submitForm: vi.fn() }))

vi.mock('src/components/form-components/FormSubmitStatusHost', () => ({
  showFormSubmitError: vi.fn(),
  showFormSubmitSuccess: vi.fn(),
}))

vi.mock('../../src/services/patientData', () => ({ getSavedData: vi.fn() }))

const NONE = '0 - Not at all'
const SEVERAL = '1 - Several days'
const HALF = '2 - More than half the days'

const renderForm = (form) =>
  render(<FormContext.Provider value={{ patientId: 7 }}>{form}</FormContext.Provider>)

// PHQ-2 of 3 = depression arm; GAD-2 of 3 = anxiety arm.
const savedPhq = ({ phq1 = NONE, phq2 = NONE, gad1 = NONE, gad2 = NONE, ...rest } = {}) => ({
  PHQ1: phq1,
  PHQ2: phq2,
  GAD1: gad1,
  GAD2: gad2,
  ...rest,
})

describe('PHQ-4 referral routing', () => {
  beforeEach(() => {
    submitForm.mockResolvedValue({ result: true })
    getSavedData.mockResolvedValue({})
  })

  describe('history taking', () => {
    it('only expands to PHQ9 once PHQ-2 reaches 3', async () => {
      const user = userEvent.setup()
      renderForm(<HxPhqForm changeTab={vi.fn()} nextTab={1} />)

      // PHQ-2 of 2 is below the cutoff — PHQ9 must stay hidden.
      await user.click((await screen.findAllByRole('radio', { name: SEVERAL }))[0])
      await user.click((await screen.findAllByRole('radio', { name: SEVERAL }))[1])
      expect(screen.queryByText(/PHQ9\. Thoughts that you would be better off dead/)).toBeNull()

      // Raising PHQ1 to 2 makes PHQ-2 = 3.
      await user.click((await screen.findAllByRole('radio', { name: HALF }))[0])
      expect(
        await screen.findByText(/PHQ9\. Thoughts that you would be better off dead/),
      ).toBeInTheDocument()
    })

    it('never asks PHQ3-PHQ8 at history taking', async () => {
      const user = userEvent.setup()
      renderForm(<HxPhqForm changeTab={vi.fn()} nextTab={1} />)

      // Push PHQ-2 past the cutoff so the expansion block is rendered at all.
      await user.click((await screen.findAllByRole('radio', { name: HALF }))[0])
      await user.click((await screen.findAllByRole('radio', { name: SEVERAL }))[1])
      await screen.findByText(/PHQ9\. Thoughts that you would be better off dead/)

      // Even expanded, only PHQ9 appears — PHQ3-PHQ8 moved to the Mental Health station.
      for (const qn of ['PHQ3.', 'PHQ4.', 'PHQ5.', 'PHQ6.', 'PHQ7.', 'PHQ8.']) {
        expect(screen.queryByText(new RegExp(qn.replace('.', '\\.')))).toBeNull()
      }
    })
  })

  describe('mental health station', () => {
    it('shows nothing to complete when neither sub-scale reached the cutoff', async () => {
      getSavedData.mockResolvedValue(savedPhq())
      renderForm(<MentalHealthPHQ />)

      expect(await screen.findByText(/Neither sub-scale reached the referral cutoff/)).toBeInTheDocument()
      expect(screen.queryByText('Anxiety — GAD-7')).not.toBeInTheDocument()
    })

    it('depression only: shows PHQ9 from history taking, no GAD-7 expansion', async () => {
      getSavedData.mockResolvedValue(savedPhq({ phq1: HALF, phq2: SEVERAL, PHQ9: SEVERAL }))
      renderForm(<MentalHealthPHQ />)

      expect(await screen.findByText('Referred for depression.')).toBeInTheDocument()
      expect(screen.getByText(/Depression — recorded at History Taking/)).toBeInTheDocument()
      expect(screen.queryByText(/Anxiety — GAD-7/)).not.toBeInTheDocument()
    })

    it('anxiety only: expands to GAD-7 without the depression block', async () => {
      getSavedData.mockResolvedValue(savedPhq({ gad1: HALF, gad2: SEVERAL }))
      renderForm(<MentalHealthPHQ />)

      expect(await screen.findByText('Referred for anxiety.')).toBeInTheDocument()
      expect(screen.getByText(/Anxiety — GAD-7/)).toBeInTheDocument()
      expect(screen.queryByText(/Depression — recorded at History Taking/)).not.toBeInTheDocument()

      // GAD3-GAD7 are asked here; GAD1/GAD2 come from history taking.
      for (const text of [
        /Worrying too much about different things/,
        /Trouble relaxing/,
        /Being so restless that it's hard to sit still/,
        /Becoming easily annoyed or irritable/,
        /Feeling afraid, as if something awful might happen/,
      ]) {
        expect(screen.getByText(text)).toBeInTheDocument()
      }
    })

    it('both: shows the depression block and the GAD-7 expansion', async () => {
      getSavedData.mockResolvedValue(
        savedPhq({ phq1: HALF, phq2: SEVERAL, gad1: HALF, gad2: SEVERAL, PHQ9: SEVERAL }),
      )
      renderForm(<MentalHealthPHQ />)

      expect(await screen.findByText('Referred for depression and anxiety.')).toBeInTheDocument()
      expect(screen.getByText(/Depression — recorded at History Taking/)).toBeInTheDocument()
      expect(screen.getByText(/Anxiety — GAD-7/)).toBeInTheDocument()
    })

    it('submits only the GAD-7 expansion, never the history-taking answers', async () => {
      const user = userEvent.setup()
      getSavedData.mockResolvedValue(
        savedPhq({
          gad1: HALF,
          gad2: SEVERAL,
          GAD3: NONE,
          GAD4: NONE,
          GAD5: NONE,
          GAD6: NONE,
          GAD7: NONE,
        }),
      )
      renderForm(<MentalHealthPHQ />)

      await user.click(await screen.findByRole('button', { name: 'Submit' }))

      expect(submitForm).toHaveBeenCalledTimes(1)
      const [payload] = submitForm.mock.calls[0]
      expect(Object.keys(payload).sort()).toEqual([
        'GAD3',
        'GAD4',
        'GAD5',
        'GAD6',
        'GAD7',
        'GAD7Total',
      ])
      // GAD1 (2) + GAD2 (1) + five zeroes.
      expect(payload.GAD7Total).toBe(3)
    })
  })
})
