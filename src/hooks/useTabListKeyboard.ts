import type { KeyboardEvent } from 'react'

export function useTabListKeyboard<T extends string>(
  keys: readonly T[],
  active: T,
  onSelect: (key: T) => void,
) {
  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    const last = keys.length - 1
    const current = keys.indexOf(active)
    let next: number

    switch (event.key) {
      case 'ArrowRight':
        next = current >= last ? 0 : current + 1
        break
      case 'ArrowLeft':
        next = current <= 0 ? last : current - 1
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = last
        break
      default:
        return
    }

    event.preventDefault()
    onSelect(keys[next])
    const tabs = event.currentTarget
      .closest('[role="tablist"]')
      ?.querySelectorAll<HTMLElement>('[role="tab"]')
    tabs?.[next]?.focus()
  }

  function getTabIndex(key: T) {
    return key === active ? 0 : -1
  }

  return { onKeyDown, getTabIndex }
}
