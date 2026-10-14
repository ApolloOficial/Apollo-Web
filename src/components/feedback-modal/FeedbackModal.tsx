import { useEffect, useId, useRef } from 'react'
import './FeedbackModal.css'

interface Action {
  label: string
  onClick: () => void
  disabled?: boolean
}
interface Props {
  image: string
  imageAlt?: string
  title: string
  description: string
  primaryAction: Action
  secondaryAction?: Action
  onClose?: () => void
  alert?: boolean
}

export function FeedbackModal({
  image,
  imageAlt = '',
  title,
  description,
  primaryAction,
  secondaryAction,
  onClose,
  alert = false,
}: Props) {
  const titleId = useId()
  const descriptionId = useId()
  const firstButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    firstButtonRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && onClose) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return (
    <div className="feedback-modal__overlay">
      <section
        className="feedback-modal"
        role={alert ? 'alertdialog' : 'dialog'}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <img className="feedback-modal__image" src={image} alt={imageAlt} />
        <h2 id={titleId}>{title}</h2>
        <p id={descriptionId}>{description}</p>
        <div
          className={
            secondaryAction
              ? 'feedback-modal__actions feedback-modal__actions--double'
              : 'feedback-modal__actions'
          }
        >
          {secondaryAction && (
            <button
              ref={firstButtonRef}
              className="feedback-modal__secondary"
              type="button"
              disabled={secondaryAction.disabled}
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </button>
          )}
          <button
            ref={secondaryAction ? undefined : firstButtonRef}
            className="feedback-modal__primary"
            type="button"
            disabled={primaryAction.disabled}
            onClick={primaryAction.onClick}
          >
            {primaryAction.label}
          </button>
        </div>
      </section>
    </div>
  )
}
