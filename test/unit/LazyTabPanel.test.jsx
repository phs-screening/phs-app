import React, { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import LazyTabPanel from '../../src/components/form-components/LazyTabPanel'

function StatefulChild() {
  const [value, setValue] = useState('')

  return (
    <input aria-label='draft' value={value} onChange={(event) => setValue(event.target.value)} />
  )
}

describe('LazyTabPanel', () => {
  it('does not mount an inactive panel before it is visited', () => {
    render(
      <LazyTabPanel value={0} index={1}>
        <div>Unvisited content</div>
      </LazyTabPanel>,
    )

    expect(screen.queryByText('Unvisited content')).not.toBeInTheDocument()
  })

  it('mounts immediately when active and exposes its tabpanel relationship', () => {
    render(
      <LazyTabPanel value={1} index={1} idPrefix='assessment'>
        <div>Active content</div>
      </LazyTabPanel>,
    )

    expect(screen.getByText('Active content')).toBeInTheDocument()
    expect(screen.getByRole('tabpanel')).toHaveAttribute('id', 'assessment-tabpanel-1')
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', 'assessment-tab-1')
  })

  it('keeps a visited child mounted and retains its state while hidden', () => {
    const { rerender } = render(
      <LazyTabPanel value={0} index={0}>
        <StatefulChild />
      </LazyTabPanel>,
    )

    fireEvent.change(screen.getByLabelText('draft'), { target: { value: 'unsubmitted value' } })

    rerender(
      <LazyTabPanel value={1} index={0}>
        <StatefulChild />
      </LazyTabPanel>,
    )

    const hiddenPanel = screen.getByRole('tabpanel', { hidden: true })
    expect(hiddenPanel).toHaveAttribute('hidden')
    expect(screen.getByLabelText('draft')).toHaveValue('unsubmitted value')

    rerender(
      <LazyTabPanel value={0} index={0}>
        <StatefulChild />
      </LazyTabPanel>,
    )

    expect(screen.getByLabelText('draft')).toHaveValue('unsubmitted value')
  })
})
