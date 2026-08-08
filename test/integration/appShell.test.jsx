import React, { useContext } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import App, { LoginContext } from '../../src/App'
import { FormContext } from '../../src/api/utils'
import { FORM_SUBMIT_STATUS_EVENT } from '../../src/components/form-components/FormSubmitStatusHost'

const mockRoutes = vi.hoisted(() => [])

vi.mock('../../src/routes', () => ({
  default: mockRoutes,
}))

function ProviderProbe() {
  const { login, profile } = useContext(LoginContext)
  const { patientId, patientInfo, updatePatientInfo, clearPatient } = useContext(FormContext)

  return (
    <div>
      <div data-testid='login-state'>{login ? 'logged-in' : 'logged-out'}</div>
      <div data-testid='profile-name'>{profile?.name || 'no-profile'}</div>
      <div data-testid='patient-id'>{patientId}</div>
      <div data-testid='patient-name'>{patientInfo.name || 'no-patient'}</div>
      <button
        type='button'
        onClick={() => updatePatientInfo({ name: 'Ada Lovelace', queueNo: 42 })}
      >
        Load Patient
      </button>
      <button type='button' onClick={clearPatient}>
        Clear Patient
      </button>
    </div>
  )
}

function renderApp() {
  mockRoutes.splice(0, mockRoutes.length, {
    path: '/',
    element: <ProviderProbe />,
  })

  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    </HelmetProvider>
  )
}

describe('App shell integration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('initializes and provides login and patient context state', async () => {
    const user = userEvent.setup()
    localStorage.setItem('authToken', 'token-123')
    localStorage.setItem('profile', JSON.stringify({ name: 'Admin User' }))

    renderApp()

    expect(screen.getByTestId('login-state')).toHaveTextContent('logged-in')
    expect(screen.getByTestId('profile-name')).toHaveTextContent('Admin User')
    expect(screen.getByTestId('patient-id')).toHaveTextContent('-1')
    expect(screen.getByTestId('patient-name')).toHaveTextContent('no-patient')

    await user.click(screen.getByRole('button', { name: 'Load Patient' }))

    expect(screen.getByTestId('patient-id')).toHaveTextContent('42')
    expect(screen.getByTestId('patient-name')).toHaveTextContent('Ada Lovelace')

    await user.click(screen.getByRole('button', { name: 'Clear Patient' }))

    expect(screen.getByTestId('patient-id')).toHaveTextContent('-1')
    expect(screen.getByTestId('patient-name')).toHaveTextContent('no-patient')
  })

  it('renders the global form submit status host', async () => {
    renderApp()

    act(() => {
      window.dispatchEvent(
        new CustomEvent(FORM_SUBMIT_STATUS_EVENT, {
          detail: {
            message: 'Saved from App shell.',
            severity: 'success',
          },
        })
      )
    })

    expect(await screen.findByText('Saved from App shell.')).toBeInTheDocument()
  })
})
