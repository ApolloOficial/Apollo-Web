import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DatePicker } from '.'

function renderPicker(onChange = vi.fn()) {
  render(<DatePicker label="Data" value="2026-11-10" onChange={onChange} />)
  const trigger = screen.getByRole('button', { name: /Data/ })
  trigger.focus()
  fireEvent.click(trigger)
  return { trigger, onChange }
}

describe('DatePicker', () => {
  it('move o foco para o dia selecionado ao abrir e liga o gatilho ao calendário', () => {
    const { trigger } = renderPicker()

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(trigger).toHaveAttribute(
      'aria-controls',
      screen.getByRole('dialog').id,
    )
    expect(
      screen.getByRole('button', { name: '10 de novembro de 2026' }),
    ).toHaveFocus()
  })

  it('navega pelos dias com as setas', () => {
    renderPicker()

    fireEvent.keyDown(document, { key: 'ArrowRight' })
    expect(
      screen.getByRole('button', { name: '11 de novembro de 2026' }),
    ).toHaveFocus()

    fireEvent.keyDown(document, { key: 'ArrowDown' })
    expect(
      screen.getByRole('button', { name: '18 de novembro de 2026' }),
    ).toHaveFocus()

    fireEvent.keyDown(document, { key: 'ArrowLeft' })
    expect(
      screen.getByRole('button', { name: '17 de novembro de 2026' }),
    ).toHaveFocus()

    fireEvent.keyDown(document, { key: 'ArrowUp' })
    expect(
      screen.getByRole('button', { name: '10 de novembro de 2026' }),
    ).toHaveFocus()
  })

  it('fecha com Escape e devolve o foco ao gatilho', () => {
    const { trigger } = renderPicker()

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveFocus()
  })

  it('escolhe um dia, fecha e devolve o foco ao gatilho', () => {
    const { trigger, onChange } = renderPicker()

    fireEvent.click(
      screen.getByRole('button', { name: '12 de novembro de 2026' }),
    )

    expect(onChange).toHaveBeenCalledWith('2026-11-12')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('não rouba o foco com Escape quando está fechado', () => {
    render(
      <>
        <DatePicker label="Data" value="" onChange={() => undefined} />
        <input aria-label="Outro campo" />
      </>,
    )
    const other = screen.getByLabelText('Outro campo')
    other.focus()

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(other).toHaveFocus()
  })
})
