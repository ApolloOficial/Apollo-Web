import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Combobox } from '.'

const options = [
  { value: '1', label: 'Sungrow' },
  { value: '2', label: 'Growatt' },
]

describe('Combobox', () => {
  it('permite escolher uma opção só pelo teclado', () => {
    const onChange = vi.fn()

    render(
      <Combobox
        label="Fabricante"
        placeholder="Digite o fabricante"
        value=""
        options={options}
        onChange={onChange}
      />,
    )

    const input = screen.getByRole('combobox', { name: 'Fabricante' })

    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(input).toHaveAttribute('aria-expanded', 'true')

    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(input.getAttribute('aria-activedescendant')).toBeTruthy()

    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onChange).toHaveBeenCalledWith('Growatt')
  })

  it('fecha a lista com Escape', () => {
    render(
      <Combobox
        label="Fabricante"
        placeholder="Digite o fabricante"
        value=""
        options={options}
        onChange={() => undefined}
      />,
    )

    const input = screen.getByRole('combobox', { name: 'Fabricante' })

    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'Escape' })

    expect(input).toHaveAttribute('aria-expanded', 'false')
  })
})
