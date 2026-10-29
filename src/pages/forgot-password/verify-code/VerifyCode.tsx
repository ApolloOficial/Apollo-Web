import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthPage } from '../../../components/auth-page'
import { Button } from '../../../components/button'
import { SimpleInput } from '../../../components/inputs/simple-input'
import { StatusMessage } from '../../../components/status-message'
import { paths } from '../../../routes/paths'
import {
  sendRecoveryCode,
  verifyRecoveryCode,
} from '../../../services/auth.service'
import type {
  RecoveryChallengeViewModel,
  ResetPasswordLocationStateViewModel,
  VerifyCodeFormViewModel,
} from '../../../types/auth.types'
import { translateAuthMessage } from '../../../utils/auth-messages'
import './VerifyCode.css'

const CODE_LENGTH = 6

const initialForm: VerifyCodeFormViewModel = {
  code: '',
}

interface VerifyCodeProps {
  challenge: RecoveryChallengeViewModel
  onRestart: () => void
}

export function VerifyCode({ challenge, onRestart }: VerifyCodeProps) {
  const [form, setForm] = useState<VerifyCodeFormViewModel>(initialForm)
  const [destination, setDestination] = useState(challenge.destination)
  const [secondsLeft, setSecondsLeft] = useState(challenge.resendInSeconds)
  const [status, setStatus] = useState<{
    loading: boolean
    resending: boolean
    error: string | null
    notice: string | null
  }>({ loading: false, resending: false, error: null, notice: null })
  const navigate = useNavigate()

  useEffect(() => {
    if (secondsLeft <= 0) return

    const timer = window.setTimeout(
      () => setSecondsLeft((current) => current - 1),
      1000,
    )

    return () => window.clearTimeout(timer)
  }, [secondsLeft])

  const canSubmit = form.code.length === CODE_LENGTH
  const busy = status.loading || status.resending

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus({ loading: true, resending: false, error: null, notice: null })

    try {
      const { resetToken } = await verifyRecoveryCode({
        challengeId: challenge.challengeId,
        code: form.code,
      })
      const state: ResetPasswordLocationStateViewModel = { resetToken }

      navigate(paths.resetPassword, { state, replace: true })
    } catch (err) {
      setStatus({
        loading: false,
        resending: false,
        error: translateAuthMessage((err as Error).message),
        notice: null,
      })
    }
  }

  async function handleResend() {
    setStatus({ loading: false, resending: true, error: null, notice: null })

    try {
      const sent = await sendRecoveryCode({
        challengeId: challenge.challengeId,
        method: challenge.method,
      })

      setDestination(sent.destination)
      setSecondsLeft(sent.resendInSeconds)
      setForm(initialForm)
      setStatus({
        loading: false,
        resending: false,
        error: null,
        notice: 'Enviamos um novo código para o seu e-mail.',
      })
    } catch (err) {
      setStatus({
        loading: false,
        resending: false,
        error: translateAuthMessage((err as Error).message),
        notice: null,
      })
    }
  }

  return (
    <AuthPage
      title="Verifique seu e-mail"
      subtitle={`Se existir uma conta associada a este e-mail, enviamos um código de ${CODE_LENGTH} dígitos${destination ? ` para ${destination}` : ''}. Digite-o abaixo para continuar.`}
      focusTitle
    >
      <form className="verify-code__form" onSubmit={handleSubmit} noValidate>
        <SimpleInput
          id="verification-code"
          label="Código de verificação"
          placeholder="000000"
          autoComplete="one-time-code"
          inputMode="numeric"
          maxLength={CODE_LENGTH}
          value={form.code}
          onChange={(code) =>
            setForm({ code: code.replace(/\D/g, '').slice(0, CODE_LENGTH) })
          }
          invalid={Boolean(status.error)}
        />
        <div className="verify-code__actions">
          <Button type="submit" fullWidth disabled={!canSubmit || busy}>
            {status.loading ? 'Verificando...' : 'Confirmar código'}
          </Button>
          <Button
            variant="secondary"
            fullWidth
            disabled={secondsLeft > 0 || busy}
            onClick={handleResend}
          >
            {secondsLeft > 0
              ? `Reenviar código em ${secondsLeft}s`
              : status.resending
                ? 'Reenviando...'
                : 'Reenviar código'}
          </Button>
          <Button variant="secondary" fullWidth onClick={onRestart}>
            Usar outro e-mail
          </Button>
        </div>
        {status.error && (
          <StatusMessage tone="alert">{status.error}</StatusMessage>
        )}
        {status.notice && (
          <StatusMessage tone="success">{status.notice}</StatusMessage>
        )}
      </form>
    </AuthPage>
  )
}
