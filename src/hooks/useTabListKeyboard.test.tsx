import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { useTabListKeyboard } from './useTabListKeyboard'

const KEYS = ['um', 'dois', 'tres'] as const
type Key = (typeof KEYS)[number]

function Tabs() {
  const [active, setActive] = useState<Key>('um')
  const tabList = useTabListKeyboard(KEYS, active, setActive)

  return (
    <div role="tablist" aria-label="Exemplo">
      {KEYS.map((key) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={active === key}
          tabIndex={tabList.getTabIndex(key)}
          onKeyDown={tabList.onKeyDown}
          onClick={() => setActive(key)}
        >
          {key}
        </button>
      ))}
    </div>
  )
}

describe('useTabListKeyboard', () => {
  it('só a aba ativa entra na ordem de tabulação', () => {
    render(<Tabs />)

    expect(screen.getByRole('tab', { name: 'um' })).toHaveAttribute(
      'tabindex',
      '0',
    )
    expect(screen.getByRole('tab', { name: 'dois' })).toHaveAttribute(
      'tabindex',
      '-1',
    )
  })

  it('as setas selecionam e focam a aba vizinha, com volta ao início e ao fim', () => {
    render(<Tabs />)
    const first = screen.getByRole('tab', { name: 'um' })
    first.focus()

    fireEvent.keyDown(first, { key: 'ArrowRight' })
    const second = screen.getByRole('tab', { name: 'dois' })
    expect(second).toHaveAttribute('aria-selected', 'true')
    expect(second).toHaveFocus()

    fireEvent.keyDown(second, { key: 'ArrowLeft' })
    fireEvent.keyDown(first, { key: 'ArrowLeft' })
    const third = screen.getByRole('tab', { name: 'tres' })
    expect(third).toHaveAttribute('aria-selected', 'true')
    expect(third).toHaveFocus()
  })

  it('Home e End vão para a primeira e a última aba', () => {
    render(<Tabs />)
    const first = screen.getByRole('tab', { name: 'um' })
    first.focus()

    fireEvent.keyDown(first, { key: 'End' })
    expect(screen.getByRole('tab', { name: 'tres' })).toHaveFocus()

    fireEvent.keyDown(screen.getByRole('tab', { name: 'tres' }), {
      key: 'Home',
    })
    expect(screen.getByRole('tab', { name: 'um' })).toHaveFocus()
  })
})
