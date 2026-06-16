import { useLayoutEffect, useRef } from 'react'

export function scrollAncestorsToTop(element) {
  let currentElement = element

  while (currentElement) {
    currentElement.scrollTop = 0
    currentElement = currentElement.parentElement
  }

  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
  window.scrollTo(0, 0)
}

export default function useScrollToTopOnChange(dependency, scrollTop) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    scrollTop?.()
    scrollAncestorsToTop(ref.current)
  }, [dependency, scrollTop])

  return ref
}
