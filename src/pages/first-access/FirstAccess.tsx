import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthPage } from '../../components/auth-page'
import { Button } from '../../components/button'
import { StatusMessage } from '../../components/status-message'
import { PasswordInput } from '../../components/inputs/password-input'
import { paths } from '../../routes/paths'
import { changePassword } from '../../services/auth.service'
import type { FirstAccessFormViewModel } from '../../types/auth.types'
import './FirstAccess.css'

const initialForm: FirstAccessFormViewModel = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

export default function FirstAccess() {
  const [form, setForm] = useState<FirstAccessFormViewModel>(initialForm)
  const [status, setStatus] = useState<{ loading: boolean; error: string | null }>({
    loading: false,
    error: null,
  })
  const navigate = useNavigate()

  const passwordsMatch = form.newPassword === form.confirmPassword
  const canSubmit =
    form.currentPassword !== '' &&
    form.newPassword !== '' &&
    form.confirmPassword !== '' &&
    passwordsMatch

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus({ loading: true, error: null })

    try {
      await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword })
      navigate(paths.home)
    } catch (err) {
      setStatus({ loading: false, error: (err as Error).message })
      return
    }

    setStatus({ loading: false, error: null })
  }

  return (
    <AuthPage title="Atualizar senha" subtitle="Defina uma nova senha pra continuar acessando sua conta.">
      <form className="update-password__form" onSubmit={handleSubmit} noValidate>
        <PasswordInput
          id="current-password"
          label="Senha atual"
          placeholder="Digite aqui sua senha atual"
          autoComplete="current-password"
          value={form.currentPassword}
          onChange={(currentPassword) => setForm((current) => ({ ...current, currentPassword }))}
          invalid={Boolean(status.error)}
        />
        <PasswordInput
          id="new-password"
          label="Nova senha"
          placeholder="Digite aqui sua nova senha"
          autoComplete="new-password"
          value={form.newPassword}
          onChange={(newPassword) => setForm((current) => ({ ...current, newPassword }))}
        />
        <PasswordInput
          id="confirm-password"
          label="Confirmar nova senha"
          placeholder="Repita a nova senha"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(confirmPassword) => setForm((current) => ({ ...current, confirmPassword }))}
          error={form.confirmPassword !== '' && !passwordsMatch ? 'As senhas não coincidem.' : undefined}
        />
        <Button type="submit" fullWidth disabled={!canSubmit || status.loading}>
          {status.loading ? 'Atualizando...' : 'Atualizar senha'}
        </Button>
        {status.error && <StatusMessage tone="alert">{status.error}</StatusMessage>}
      </form>
    </AuthPage>
  )
}