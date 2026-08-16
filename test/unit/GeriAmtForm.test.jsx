import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { FormContext } from '../../src/api/utils'
import GeriAmtForm from '../../src/forms/GeriCognitiveTabs/GeriAmtForm'
import { hasFailedAmt, AMT_PASS_MARK } from '../../src/forms/questions/GeriAmtFormQuestions'
import { getSavedData } from '../../src/services/patientData'

vi.mock('../../src/services/patientData', () => ({
  getSavedData: vi.fn(),
}))

describe('GeriAmtForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getSavedData
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({
        registrationQ3: '1950-05-06T00:00:00.000Z',
        registrationQ4: 76,
      })
  })

  it('shows the AMT instructions, references, recall phrase, and question 8 image', async () => {
    render(
      <MemoryRouter>
        <FormContext.Provider value={{ patientId: 7 }}>
          <GeriAmtForm changeTab={vi.fn()} nextTab={2} />
        </FormContext.Provider>
      </MemoryRouter>,
    )

    expect(
      screen.getByText(/Before you start the AMT, please \(1\) ask for the participant's NRIC/),
    ).toBeInTheDocument()

    const questionImage = screen.getByRole('img', {
      name: 'Doctor and nurse shown for AMT question 8',
    })
    expect(questionImage).toHaveAttribute('src', '/images/geri-amt/q8-occupation.jpg')

    expect(await screen.findByText('Question 4: Date of Birth')).toBeInTheDocument()
    expect(screen.getAllByText('"37 Bukit Timah Road"')).toHaveLength(2)
    expect(screen.getByText('6 May 1950')).toBeInTheDocument()
    expect(screen.getByText('76')).toBeInTheDocument()
  })
})

describe('AMT pass mark by education level', () => {
  it('passes at 7/10 and above for Before PSLE', () => {
    expect(AMT_PASS_MARK['Before PSLE']).toBe(7)
    expect(hasFailedAmt(6, 'Before PSLE')).toBe(true)
    expect(hasFailedAmt(7, 'Before PSLE')).toBe(false)
    expect(hasFailedAmt(10, 'Before PSLE')).toBe(false)
  })

  it('passes at 9/10 and above for After PSLE', () => {
    expect(AMT_PASS_MARK['After PSLE']).toBe(9)
    expect(hasFailedAmt(8, 'After PSLE')).toBe(true)
    expect(hasFailedAmt(9, 'After PSLE')).toBe(false)
    expect(hasFailedAmt(10, 'After PSLE')).toBe(false)
  })

  it('applies the stricter mark only to After PSLE', () => {
    // A score of 7 or 8 passes Before PSLE but fails After PSLE.
    for (const score of [7, 8]) {
      expect(hasFailedAmt(score, 'Before PSLE')).toBe(false)
      expect(hasFailedAmt(score, 'After PSLE')).toBe(true)
    }
  })

  it('does not treat an unanswered education level as a failure', () => {
    expect(hasFailedAmt(0, '')).toBe(false)
    expect(hasFailedAmt(0, undefined)).toBe(false)
  })
})
