import type { StepperProps } from '../../types/ui.types'
import './Stepper.css'

export function Stepper({ children }: StepperProps) {
  return <ol className="stepper">{children}</ol>
}
