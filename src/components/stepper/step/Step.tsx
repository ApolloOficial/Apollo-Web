import type { StepProps } from '../../../types/ui.types'
import './Step.css'

export function Step({ number, title, status, onEdit, children }: StepProps) {
  return (
    <li
      className={`step step--${status}`}
      aria-current={status === 'active' ? 'step' : undefined}
    >
      <div className="step__marker">
        <span className="step__number">{number}</span>
        <span className="step__line" aria-hidden="true" />
      </div>

      <div className="step__body">
        <div className="step__header">
          <h2 className="step__title">{title}</h2>

          {status === 'done' && onEdit && (
            <button className="step__edit" type="button" onClick={onEdit}>
              Editar
            </button>
          )}
        </div>

        {children && <div className="step__content">{children}</div>}
      </div>
    </li>
  )
}
