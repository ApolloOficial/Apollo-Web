import { useState } from 'react'
import type { FormEvent } from 'react'
import { AuthPage } from '../../components/auth-page'
import { Button, ButtonLink } from '../../components/button'
import { MailIcon } from '../../components/icons/mail-icon'
import { SimpleInput } from '../../components/inputs/simple-input'
import { StatusMessage } from '../../components/status-message'
import { paths } from '../../routes/paths'
import {
  sendRecoveryCode,
  startPasswordRecovery,
} from '../../services/auth.service'
import type {
  ForgotPasswordFormValues,
  RecoveryChallengeViewModel,
} from '../../types/auth.types'
import { translateAuthMessage } from '../../utils/auth-messages'
import { VerifyCode } from './verify-code'
import './ForgotPassword.css'

const PREFERRED_METHOD = 'EMAIL'

const initialForm: ForgotPasswordFormValues = {
  email: '',
}

export default function ForgotPassword() {
  const [form, setForm] = useState<ForgotPasswordFormValues>(initialForm)
  const [challenge, setChallenge] = useState<RecoveryChallengeViewModel | null>(
    null,
  )
  const [status, setStatus] = useState<{
    loading: boolean
    error: string | null
  }>({
    loading: false,
    error: null,
  })

  const canSubmit = form.email.trim() !== ''

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus({ loading: true, error: null })

    try {
      const started = await startPasswordRecovery({ email: form.email.trim() })
      const method =
        started.methods.find((item) => item.method === PREFERRED_METHOD)
          ?.method ?? started.methods[0]?.method

      if (!method) {
        throw new Error('Nenhum método de recuperação disponível.')
      }

      const sent = await sendRecoveryCode({
        challengeId: started.challengeId,
        method,
      })

      setChallenge({
        challengeId: started.challengeId,
        method,
        destination: sent.destination,
        resendInSeconds: sent.resendInSeconds,
      })
      setStatus({ loading: false, error: null })
    } catch (err) {
      setStatus({
        loading: false,
        error: translateAuthMessage((err as Error).message),
      })
    }
  }

  if (challenge) {
    return (
      <VerifyCode challenge={challenge} onRestart={() => setChallenge(null)} />
    )
  }

  return (
    <AuthPage
      title="Esqueci minha senha"
      subtitle="Informe seu e-mail e enviaremos um código de verificação para redefinir sua senha."
    >
      <form
        className="forgot-password__form"
        onSubmit={handleSubmit}
        noValidate
      >
        <SimpleInput
          id="email"
          label="E-mail"
          type="email"
          placeholder="seuemail@institucional.com"
          autoComplete="username"
          icon={<MailIcon />}
          value={form.email}
          onChange={(email) => setForm((current) => ({ ...current, email }))}
          invalid={Boolean(status.error)}
        />
        <div className="forgot-password__actions">
          <Button
            type="submit"
            fullWidth
            disabled={!canSubmit || status.loading}
          >
            {status.loading ? 'Enviando...' : 'Enviar'}
          </Button>
          <ButtonLink to={paths.login} variant="secondary" fullWidth>
            Voltar para login
          </ButtonLink>
        </div>
        {status.error && (
          <StatusMessage tone="alert">{status.error}</StatusMessage>
        )}
      </form>
    </AuthPage>
  )
}
