import { AlertIcon } from '../icons/alert-icon'
import type { StatusMessageProps } from '../../types/ui.types'
import './StatusMessage.css'

export function StatusMessage({ tone, children }: StatusMessageProps) {
  return (
    <p
      className={`status-message status-message--${tone}`}
      role={tone === 'success' ? 'status' : 'alert'}
    >
      {tone === 'alert' && <AlertIcon className="status-message__icon" />}
      {children}
    </p>
  )
}
