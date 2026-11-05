import { useId, useRef, useState } from 'react'
import { Button } from '../../../../components/button'
import { TextareaInput } from '../../../../components/inputs/textarea-input'
import { useModalFocus } from '../../../../hooks/useModalFocus'
import { cancelServiceOrder } from '../../../../services/service-orders.service'

interface Props {
  orderId: number
  initialReason: string
  onClose: () => void
  onCancelled: () => void
}

export function CancelServiceOrderModal({
  orderId,
  initialReason,
  onClose,
  onCancelled,
}: Props) {
  const titleId = useId()
  const reasonId = useId()
  const dialogRef = useRef<HTMLElement>(null)
  const firstButtonRef = useRef<HTMLButtonElement>(null)
  const [reason, setReason] = useState(initialReason)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useModalFocus(dialogRef, firstButtonRef, saving ? undefined : onClose)

  async function handleConfirm() {
    if (!reason.trim()) {
      setError('Informe o motivo do cancelamento.')
      return
    }

    setSaving(true)
    setError('')

    try {
      await cancelServiceOrder(orderId, reason.trim())
      onCancelled()
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Não foi possível cancelar a ordem de serviço.',
      )
      setSaving(false)
    }
  }

  return (
    <div className="feedback-modal__overlay">
      <section
        ref={dialogRef}
        className="cancel-order-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <h2 id={titleId}>Cancelar OS{String(orderId).padStart(5, '0')}</h2>
        <p>
          A OS será cancelada e o alerta de origem volta a ficar ativo. Essa
          ação não pode ser desfeita.
        </p>

        <TextareaInput
          id={reasonId}
          label="Motivo do cancelamento"
          value={reason}
          onChange={setReason}
          maxLength={400}
          required
        />

        {error && (
          <p className="cancel-order-modal__error" role="alert">
            {error}
          </p>
        )}

        <div className="cancel-order-modal__actions">
          <button
            ref={firstButtonRef}
            type="button"
            className="button button--secondary"
            onClick={onClose}
            disabled={saving}
          >
            <span className="button__label">Voltar</span>
          </button>
          <Button loading={saving} onClick={handleConfirm}>
            Cancelar OS
          </Button>
        </div>
      </section>
    </div>
  )
}
