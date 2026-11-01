import type { FormActionsProps } from '../../types/ui.types'
import './FormActions.css'

export function FormActions({ children }: FormActionsProps) {
  return <div className="form-actions">{children}</div>
}
