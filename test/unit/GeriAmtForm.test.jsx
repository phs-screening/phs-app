import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { FormContext } from '../../src/api/utils'
import GeriAmtForm from '../../src/forms/GeriCognitiveTabs/GeriAmtForm'
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
