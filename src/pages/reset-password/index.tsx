import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AuthPage } from '../../components/auth-page'
import { Button } from '../../components/button'
import { PasswordInput } from '../../components/inputs/password-input'
import { StatusMessage } from '../../components/status-message'
import { paths } from '../../routes/paths'
import { resetPassword } from '../../services/auth.service'
import type {
  ResetPasswordFormValues,
  ResetPasswordLocationStateViewModel,
} from '../../types/auth.types'
import { translateAuthMessage } from '../../utils/auth-messages'
import { PASSWORD_RULES_MESSAGE, isValidPassword } from '../../utils/validators'
import './ResetPassword.css'

const initialForm: ResetPasswordFormValues = {
  newPassword: '',
  confirmPassword: '',
}

function getResetToken(state: unknown): string | null {
  if (typeof state !== 'object' || state === null) return null

  const { resetToken } = state as Partial<ResetPasswordLocationStateViewModel>

  return typeof resetToken === 'string' && resetToken !== '' ? resetToken : null
}

export default function ResetPassword() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [form, setForm] = useState<ResetPasswordFormValues>(initialForm)
  const [status, setStatus] = useState<{
    loading: boolean
    error: string | null
  }>({
    loading: false,
    error: null,
  })

  const [resetToken] = useState(() => getResetToken(state))
  const newPasswordValid = isValidPassword(form.newPassword)
  const passwordsMatch = form.newPassword === form.confirmPassword
  const canSubmit =
    form.newPassword !== '' &&
    form.confirmPassword !== '' &&
    newPasswordValid &&
    passwordsMatch

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!resetToken) return

    setStatus({ loading: true, error: null })

    try {
      await resetPassword({ resetToken, newPassword: form.newPassword })
      navigate(paths.login, {
        replace: true,
        state: { passwordReset: true },
      })
    } catch (err) {
      setStatus({
        loading: false,
        error: translateAuthMessage((err as Error).message),
      })
    }
  }

  if (!resetToken) return <Navigate to={paths.forgotPassword} replace />

  return (
    <AuthPage
      title="Redefina sua senha"
      subtitle="Crie uma nova senha para proteger sua conta."
    >
      <form className="reset-password__form" onSubmit={handleSubmit} noValidate>
        <PasswordInput
          id="new-password"
          label="Nova senha"
          placeholder="Digite uma nova senha"
          autoComplete="new-password"
          icon={null}
          value={form.newPassword}
          onChange={(newPassword) =>
            setForm((current) => ({ ...current, newPassword }))
          }
        />
        <PasswordInput
          id="confirm-password"
          label="Confirmar nova senha"
          placeholder="Repita a nova senha"
          autoComplete="new-password"
          icon={null}
          value={form.confirmPassword}
          onChange={(confirmPassword) =>
            setForm((current) => ({ ...current, confirmPassword }))
          }
          error={
            form.confirmPassword !== '' && !passwordsMatch
              ? 'As senhas não coincidem.'
              : undefined
          }
        />
        <div className="reset-password__hint" aria-live="polite">
          {status.error ? (
            <StatusMessage tone="alert">{status.error}</StatusMessage>
          ) : (
            form.newPassword !== '' &&
            !newPasswordValid && (
              <StatusMessage tone="alert">
                {PASSWORD_RULES_MESSAGE}
              </StatusMessage>
            )
          )}
        </div>
        <Button
          type="submit"
          fullWidth
          disabled={!canSubmit}
          loading={status.loading}
        >
          Redefinir senha
        </Button>
      </form>
    </AuthPage>
  )
}
