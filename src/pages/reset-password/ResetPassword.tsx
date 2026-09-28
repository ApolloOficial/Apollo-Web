import { useState } from 'react'
import type { FormEvent } from 'react'
import { AuthPage } from '../../components/auth-page'
import { Button } from '../../components/button'
import { PasswordInput } from '../../components/inputs/password-input'
import { StatusMessage } from '../../components/status-message'
import type { ResetPasswordFormValues } from '../../types/auth.types'
import { PasswordResetSuccess } from './password-reset-success'
import './ResetPassword.css'

const initialForm: ResetPasswordFormValues = {
  newPassword: '',
  confirmPassword: '',
}

export default function ResetPassword() {
  const [form, setForm] = useState<ResetPasswordFormValues>(initialForm)
  const [isReset, setIsReset] = useState(false)

  const canSubmit = form.newPassword !== '' && form.confirmPassword !== ''

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsReset(true)
  }

  if (isReset) return <PasswordResetSuccess />

  return (
    <AuthPage title="Redefina sua senha" subtitle="Crie uma nova senha para proteger sua conta.">
      <form className="reset-password__form" onSubmit={handleSubmit} noValidate>
        <PasswordInput
          id="new-password"
          label="Nova senha"
          placeholder="Digite uma nova senha"
          autoComplete="new-password"
          icon={null}
          value={form.newPassword}
          onChange={(newPassword) => setForm((current) => ({ ...current, newPassword }))}
        />
        <PasswordInput
          id="confirm-password"
          label="Confirmar nova senha"
          placeholder="Repita a nova senha"
          autoComplete="new-password"
          icon={null}
          value={form.confirmPassword}
          onChange={(confirmPassword) => setForm((current) => ({ ...current, confirmPassword }))}
        />
        <div className="reset-password__hint" aria-live="polite">
          {form.newPassword !== '' && (
            <StatusMessage tone="alert">
              A senha deve ter no mínimo 8 caracteres, letras maiúsculas, minúsculas e números.
            </StatusMessage>
          )}
        </div>
        <Button type="submit" fullWidth disabled={!canSubmit}>
          Redefinir senha
        </Button>
      </form>
    </AuthPage>
  )
}
