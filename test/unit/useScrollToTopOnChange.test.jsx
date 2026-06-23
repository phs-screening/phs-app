import React, { forwardRef, useImperativeHandle } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import useScrollToTopOnChange, {
  scrollAncestorsToTop,
} from '../../src/hooks/useScrollToTopOnChange'

const ScrollHost = forwardRef(({ dependency, scrollTop }, ref) => {
  const scrollRef = useScrollToTopOnChange(dependency, scrollTop)

  useImperativeHandle(ref, () => ({
    getScrollTarget: () => scrollRef.current,
  }))

  return (
    <div data-testid='outer'>
      <div data-testid='middle'>
        <div ref={scrollRef} data-testid='target' />
      </div>
    </div>
  )
})

ScrollHost.displayName = 'ScrollHost'

describe('useScrollToTopOnChange', () => {
  beforeEach(() => {
    window.scrollTo = vi.fn()
    document.documentElement.scrollTop = 25
    document.body.scrollTop = 50
  })

  it('scrolls an element and all of its ancestors to the top', () => {
    const outer = document.createElement('div')
    const middle = document.createElement('div')
    const target = document.createElement('div')

    outer.scrollTop = 30
    middle.scrollTop = 20
    target.scrollTop = 10
    outer.appendChild(middle)
    middle.appendChild(target)
    document.body.appendChild(outer)

    scrollAncestorsToTop(target)

    expect(target.scrollTop).toBe(0)
    expect(middle.scrollTop).toBe(0)
    expect(outer.scrollTop).toBe(0)
    expect(document.documentElement.scrollTop).toBe(0)
    expect(document.body.scrollTop).toBe(0)
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)

    document.body.removeChild(outer)
  })

  it('still resets document scroll positions when no element is provided', () => {
    scrollAncestorsToTop(null)

    expect(document.documentElement.scrollTop).toBe(0)
    expect(document.body.scrollTop).toBe(0)
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('runs the optional scrollTop callback and returns a ref for the target element', () => {
    const scrollTop = vi.fn()
    const hostRef = React.createRef()

    render(<ScrollHost ref={hostRef} dependency='patient-1' scrollTop={scrollTop} />)

    expect(scrollTop).toHaveBeenCalledTimes(1)
    expect(hostRef.current.getScrollTarget()).toHaveAttribute('data-testid', 'target')
  })

  it('runs again when the dependency changes', () => {
    const scrollTop = vi.fn()
    const { rerender } = render(
      <ScrollHost dependency='patient-1' scrollTop={scrollTop} />
    )

    rerender(<ScrollHost dependency='patient-2' scrollTop={scrollTop} />)

    expect(scrollTop).toHaveBeenCalledTimes(2)
    expect(window.scrollTo).toHaveBeenCalledTimes(2)
  })
})
