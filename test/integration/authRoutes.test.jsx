import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter, useLocation } from 'react-router-dom'
import App from '../../src/App'
import { getProfile } from '../../src/services/authSession'

vi.mock('../../src/services/authSession', async () => {
  const actual = await vi.importActual('../../src/services/authSession')

  return {
    ...actual,
    getProfile: vi.fn(),
  }
})

function MockPage({ name }) {
  const location = useLocation()

  return (
    <div>
      <div data-testid='current-path'>{location.pathname}</div>
      <div data-testid={`${name}-page`}>{name}</div>
    </div>
  )
}

vi.mock('../../src/pages/Login', () => ({
  default: () => <MockPage name='login' />,
}))

vi.mock('../../src/pages/Registration', () => ({
  default: () => <MockPage name='registration' />,
}))

vi.mock('../../src/pages/Dashboard', () => ({
  default: () => <MockPage name='dashboard' />,
}))

vi.mock('../../src/pages/ManageVolunteers', () => ({
  default: () => <MockPage name='manage-volunteers' />,
}))

function renderApp(initialPath) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <App />
      </MemoryRouter>
    </HelmetProvider>
  )
}

describe('auth route access integration', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn()
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('redirects logged-out users away from protected app routes', async () => {
    renderApp('/app/dashboard')

    expect(await screen.findByTestId('login-page')).toBeInTheDocument()
    expect(screen.getByTestId('current-path')).toHaveTextContent('/login')
    expect(screen.queryByTestId('dashboard-page')).not.toBeInTheDocument()
  })

  it('redirects logged-in users away from guest-only login route', async () => {
    localStorage.setItem('authToken', 'token-123')

    renderApp('/login')

    expect(await screen.findByTestId('registration-page')).toBeInTheDocument()
    expect(screen.getByTestId('current-path')).toHaveTextContent('/app/registration')
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument()
  })

  it('sends logged-in users from the default route to registration', async () => {
    localStorage.setItem('authToken', 'token-123')

    renderApp('/')

    expect(await screen.findByTestId('registration-page')).toBeInTheDocument()
    expect(screen.getByTestId('current-path')).toHaveTextContent('/app/registration')
  })

  it('allows admin users through admin app routes', async () => {
    localStorage.setItem('authToken', 'token-123')
    getProfile.mockResolvedValue({ username: 'admin@example.com', is_admin: true })

    renderApp('/app/manage')

    expect(await screen.findByTestId('manage-volunteers-page')).toBeInTheDocument()
    expect(screen.getByTestId('current-path')).toHaveTextContent('/app/manage')
    expect(localStorage.getItem('profile')).toBe(
      JSON.stringify({ username: 'admin@example.com', is_admin: true })
    )
  })

  it('redirects non-admin users away from admin app routes', async () => {
    localStorage.setItem('authToken', 'token-123')
    getProfile.mockResolvedValue({ username: 'guest@example.com', is_admin: false })

    renderApp('/app/manage')

    await waitFor(() => {
      expect(screen.getByTestId('registration-page')).toBeInTheDocument()
    })
    expect(screen.getByTestId('current-path')).toHaveTextContent('/app/registration')
    expect(screen.queryByTestId('manage-volunteers-page')).not.toBeInTheDocument()
  })
})
