import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ErrorState } from '.'

describe('ErrorState', () => {
  it('anuncia o erro e chama a nova tentativa', () => {
    const onRetry = vi.fn()

    render(<ErrorState message="Servidor indisponível." onRetry={onRetry} />)

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Servidor indisponível.',
    )

    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
