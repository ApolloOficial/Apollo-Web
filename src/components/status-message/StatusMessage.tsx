import type { StatusMessageProps } from '../../types/ui.types'
import './StatusMessage.css'

export function StatusMessage({ tone, children }: StatusMessageProps) {
  return (
    <p
      className={`status-message status-message--${tone}`}
      role={tone === 'success' ? 'status' : undefined}
    >
      {children}
    </p>
  )
}
