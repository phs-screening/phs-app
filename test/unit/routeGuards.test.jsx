import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import AdminRoute from '../../src/components/AdminRoute'
import DefaultRoute from '../../src/components/DefaultRoute'
import GuestOnlyRoute from '../../src/components/GuestOnlyRoute'
import ProtectedRoute from '../../src/components/ProtectedRoute'
import { getProfile, isLoggedin } from '../../src/services/authSession'
import { LoginContext } from '../../src/App.jsx'

vi.mock('../../src/services/authSession', () => ({
  getProfile: vi.fn(),
  isLoggedin: vi.fn(),
}))

vi.mock('../../src/App.jsx', async () => {
  const React = await import('react')
  return {
    LoginContext: React.createContext({
      setProfile: () => {},
    }),
  }
})

const ProtectedContent = () => <div>Protected content</div>
const GuestContent = () => <div>Guest content</div>
const AdminContent = () => <div>Admin content</div>

function CurrentPath() {
  const location = useLocation()
  return <div data-testid='current-path'>{location.pathname}</div>
}

function renderWithRoutes(initialPath, routeElement, extraRoutes = null) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path={initialPath} element={routeElement} />
        <Route path='/login' element={<CurrentPath />} />
        <Route path='/app/registration' element={<CurrentPath />} />
        <Route path='/not-admin' element={<CurrentPath />} />
        {extraRoutes}
      </Routes>
    </MemoryRouter>
  )
}

describe('route guards', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('ProtectedRoute', () => {
    it('renders children for logged-in users', () => {
      isLoggedin.mockReturnValue(true)

      renderWithRoutes(
        '/private',
        <ProtectedRoute>
          <ProtectedContent />
        </ProtectedRoute>
      )

      expect(screen.getByText('Protected content')).toBeInTheDocument()
    })

    it('redirects logged-out users to login', () => {
      isLoggedin.mockReturnValue(false)

      renderWithRoutes(
        '/private',
        <ProtectedRoute>
          <ProtectedContent />
        </ProtectedRoute>
      )

      expect(screen.getByTestId('current-path')).toHaveTextContent('/login')
      expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
    })
  })

  describe('GuestOnlyRoute', () => {
    it('renders children for logged-out users', () => {
      isLoggedin.mockReturnValue(false)

      renderWithRoutes(
        '/login-page',
        <GuestOnlyRoute>
          <GuestContent />
        </GuestOnlyRoute>
      )

      expect(screen.getByText('Guest content')).toBeInTheDocument()
    })

    it('redirects logged-in users to registration', () => {
      isLoggedin.mockReturnValue(true)

      renderWithRoutes(
        '/login-page',
        <GuestOnlyRoute>
          <GuestContent />
        </GuestOnlyRoute>
      )

      expect(screen.getByTestId('current-path')).toHaveTextContent('/app/registration')
      expect(screen.queryByText('Guest content')).not.toBeInTheDocument()
    })
  })

  describe('DefaultRoute', () => {
    it('redirects logged-in users to registration', () => {
      isLoggedin.mockReturnValue(true)

      renderWithRoutes('/', <DefaultRoute />)

      expect(screen.getByTestId('current-path')).toHaveTextContent('/app/registration')
    })

    it('redirects logged-out users to login', () => {
      isLoggedin.mockReturnValue(false)

      renderWithRoutes('/', <DefaultRoute />)

      expect(screen.getByTestId('current-path')).toHaveTextContent('/login')
    })
  })

  describe('AdminRoute', () => {
    it('renders nothing while admin status is loading', () => {
      getProfile.mockReturnValue(new Promise(() => {}))

      renderWithRoutes(
        '/admin',
        <LoginContext.Provider value={{ setProfile: vi.fn() }}>
          <AdminRoute>
            <AdminContent />
          </AdminRoute>
        </LoginContext.Provider>
      )

      expect(screen.queryByText('Admin content')).not.toBeInTheDocument()
      expect(screen.queryByTestId('current-path')).not.toBeInTheDocument()
    })

    it('renders children and stores profile for admin users', async () => {
      const setProfile = vi.fn()
      const profile = { name: 'Admin User', is_admin: true }
      getProfile.mockResolvedValue(profile)

      renderWithRoutes(
        '/admin',
        <LoginContext.Provider value={{ setProfile }}>
          <AdminRoute>
            <AdminContent />
          </AdminRoute>
        </LoginContext.Provider>
      )

      expect(await screen.findByText('Admin content')).toBeInTheDocument()
      expect(setProfile).toHaveBeenCalledWith(profile)
      expect(localStorage.getItem('profile')).toBe(JSON.stringify(profile))
    })

    it('redirects non-admin users to the default registration route', async () => {
      const setProfile = vi.fn()
      const profile = { name: 'Volunteer', is_admin: false }
      getProfile.mockResolvedValue(profile)

      renderWithRoutes(
        '/admin',
        <LoginContext.Provider value={{ setProfile }}>
          <AdminRoute>
            <AdminContent />
          </AdminRoute>
        </LoginContext.Provider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('current-path')).toHaveTextContent('/app/registration')
      })
      expect(screen.queryByText('Admin content')).not.toBeInTheDocument()
      expect(setProfile).toHaveBeenCalledWith(profile)
      expect(localStorage.getItem('profile')).toBe(JSON.stringify(profile))
    })

    it('uses the custom redirect route when supplied', async () => {
      getProfile.mockResolvedValue(null)

      renderWithRoutes(
        '/admin',
        <LoginContext.Provider value={{ setProfile: vi.fn() }}>
          <AdminRoute redirectTo='/not-admin'>
            <AdminContent />
          </AdminRoute>
        </LoginContext.Provider>
      )

      await waitFor(() => {
        expect(screen.getByTestId('current-path')).toHaveTextContent('/not-admin')
      })
    })
  })
})
