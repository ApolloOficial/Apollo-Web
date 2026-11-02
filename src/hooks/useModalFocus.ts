import { useEffect, useRef, type RefObject } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function useModalFocus<T extends HTMLElement>(
  containerRef: RefObject<T | null>,
  initialFocusRef: RefObject<HTMLElement | null>,
  onEscape?: () => void,
): void {
  const onEscapeRef = useRef(onEscape)

  useEffect(() => {
    onEscapeRef.current = onEscape
  }, [onEscape])

  useEffect(() => {
    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    initialFocusRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        if (onEscapeRef.current) {
          event.preventDefault()
          onEscapeRef.current()
        }
        return
      }

      if (event.key !== 'Tab' || !containerRef.current) return

      const focusable = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      )

      if (focusable.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (
        event.shiftKey &&
        (active === first || !containerRef.current.contains(active))
      ) {
        event.preventDefault()
        last.focus()
      } else if (
        !event.shiftKey &&
        (active === last || !containerRef.current.contains(active))
      ) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus()
    }
  }, [containerRef, initialFocusRef])
}
