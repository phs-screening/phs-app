import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import OralHealthForm from '../../src/forms/OralHealthForm'
import ScoliosisForm from '../../src/forms/ScoliosisForm'
import WceForm from '../../src/forms/WceTabs/WceForm'
import { mentalHealthFormQuestionText } from '../../src/forms/questions/MentalHealthFormQuestions'
import { FormContext } from '../../src/api/utils'
import { getSavedData } from '../../src/services/patientData'

vi.mock('../../src/services/patientData', () => ({
  getSavedData: vi.fn(),
}))

function renderStationForm(form) {
  return render(
    <MemoryRouter>
      <FormContext.Provider value={{ patientId: 7 }}>{form}</FormContext.Provider>
    </MemoryRouter>,
  )
}

describe('station form updates', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getSavedData.mockResolvedValue({})
  })

  it('removes DENT2 and its dependent detail field from Dentistry', async () => {
    renderStationForm(<OralHealthForm />)

    expect(await screen.findByText('Patient has completed Oral Health station?')).toBeInTheDocument()
    expect(
      screen.queryByText('Are you on any blood thinners or have any bleeding disorders?'),
    ).not.toBeInTheDocument()
    expect(screen.queryByLabelText('DENTShortAns2')).not.toBeInTheDocument()
  })

  it('adds the required Doctor Station referral to Scoliosis as scoliosisQ3', async () => {
    renderStationForm(<ScoliosisForm />)

    expect(await screen.findByText("Refer participant to Doctor's Station?")).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'scoliosisQ3' })).toBeInTheDocument()
  })

  it('adds the Doctor Station referral and removes HPV eligibility from WCE', async () => {
    renderStationForm(<WceForm />)

    expect(await screen.findByText("Refer participant to Doctor's Station?")).toBeInTheDocument()
    const referral = screen.getByRole('group', { name: 'WCE Q13' })
    expect(referral).toBeInTheDocument()
    expect(referral.querySelectorAll('input')).toHaveLength(2)
    expect(screen.queryByText('HPV Test Eligibility')).not.toBeInTheDocument()
  })

  it('names NTUC Health in the SAMH2 question', () => {
    expect(mentalHealthFormQuestionText.SAMH2).toBe(
      'Patient has signed up for follow-up with NTUC Health?',
    )
  })
})
