import type { StepProps } from '../../../types/ui.types'
import './Step.css'

export function Step({ number, title, status, onEdit, children }: StepProps) {
  const canEdit = status === 'done' && onEdit

  return (
    <li
      className={`step step--${status}`}
      aria-current={status === 'active' ? 'step' : undefined}
    >
      <div className="step__marker">
        {canEdit ? (
          <button
            className="step__number step__number--action"
            type="button"
            aria-label={`Voltar para ${title}`}
            onClick={onEdit}
          >
            {number}
          </button>
        ) : (
          <span className="step__number">{number}</span>
        )}
        <span className="step__line" aria-hidden="true" />
      </div>

      <div className="step__body">
        <div className="step__header">
          <h2 className="step__title">{title}</h2>
        </div>

        {children && <div className="step__content">{children}</div>}
      </div>
    </li>
  )
}
