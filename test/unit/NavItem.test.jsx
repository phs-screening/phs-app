import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NavItem from '../../src/components/NavItem'

const TestIcon = vi.fn((props) => (
  <svg aria-label='test icon' data-size={props.size} />
))

function renderNavItem(props, initialPath = '/app/dashboard') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <NavItem href='/app/dashboard' title='Dashboard' {...props} />
    </MemoryRouter>
  )
}

describe('NavItem', () => {
  it('renders a navigation link with the supplied title and href', () => {
    renderNavItem()

    const link = screen.getByRole('link', { name: 'Dashboard' })

    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/app/dashboard')
  })

  it('renders the supplied icon with the expected size', () => {
    renderNavItem({ icon: TestIcon })

    expect(screen.getByLabelText('test icon')).toHaveAttribute('data-size', '20')
  })

  it('marks the link as current when the route matches', () => {
    renderNavItem({}, '/app/dashboard/details')

    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
      'aria-current',
      'page'
    )
  })

  it('does not mark the link as current when the route does not match', () => {
    renderNavItem({}, '/app/settings')

    expect(screen.getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute(
      'aria-current'
    )
  })

  it('disables the navigation item when requested', () => {
    renderNavItem({ shouldDisable: true })

    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-disabled', 'true')
  })
})
