import { useEffect, useRef } from 'react'
import { Spinner } from '../../../../components/spinner'
import illustration from '../../../../assets/images/employee-deactivate.png'

interface Props {
  employeeName: string
  submitting: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeactivateEmployeeModal({
  employeeName,
  submitting,
  onClose,
  onConfirm,
}: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    closeRef.current?.focus()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !submitting) onClose()
    }
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('keydown', escape)
      document.body.style.overflow = previous
    }
  }, [onClose, submitting])

  return (
    <div className="deactivate-modal__overlay">
      <section
        className="deactivate-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="deactivate-title"
      >
        <img
          className="deactivate-modal__illustration"
          src={illustration}
          alt=""
        />
        <h2 id="deactivate-title">
          Tem certeza que quer
          <br />
          desligar funcionário?
        </h2>
        <p>
          <span className="sr-only">Funcionário: {employeeName}. </span>
          Ele fica sem acesso ao sistema. Os dados dele continuam salvos.
        </p>
        <div className="deactivate-modal__actions">
          <button
            ref={closeRef}
            className="deactivate-modal__close"
            disabled={submitting}
            onClick={onClose}
          >
            Fechar
          </button>
          <button
            className="deactivate-modal__confirm"
            disabled={submitting}
            onClick={onConfirm}
          >
            {submitting ? <Spinner /> : 'Confirmar'}
          </button>
        </div>
      </section>
    </div>
  )
}
