import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthPage } from '../../components/auth-page'
import { Button } from '../../components/button'
import { StatusMessage } from '../../components/status-message'
import { MailIcon } from '../../components/icons/mail-icon'
import { Checkbox } from '../../components/inputs/checkbox'
import { PasswordInput } from '../../components/inputs/password-input'
import { SimpleInput } from '../../components/inputs/simple-input'
import { TextLink } from '../../components/text-link'
import { paths } from '../../routes/paths'
import { login } from '../../services/auth.service'
import { saveSession } from '../../utils/session'
import type { LoginFormViewModel } from '../../types/auth.types'
import './Login.css'

const initialForm: LoginFormViewModel = {
  email: '',
  password: '',
  remember: false,
}

export default function Login() {
  const [form, setForm] = useState<LoginFormViewModel>(initialForm)
  const [status, setStatus] = useState<{ loading: boolean; error: string | null }>({
    loading: false,
    error: null,
  })
  const navigate = useNavigate()

  const canSubmit = form.email.trim() !== '' && form.password !== ''

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus({ loading: true, error: null })

    try {
      const { token, tokenType, firstAccess } = await login({ email: form.email, password: form.password })
      saveSession({ token, tokenType })
      navigate(firstAccess ? paths.updatePassword : paths.home)
    } catch (err) {
      setStatus({ loading: false, error: (err as Error).message })
      return
    }

    setStatus({ loading: false, error: null })
  }

  return (
    <AuthPage title="Entrar" subtitle="Acesse sua conta para continuar">
      <form className="login__form" onSubmit={handleSubmit} noValidate>
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
        <PasswordInput
          id="password"
          label="Senha"
          placeholder="Digite aqui sua senha"
          autoComplete="current-password"
          value={form.password}
          onChange={(password) => setForm((current) => ({ ...current, password }))}
          invalid={Boolean(status.error)}
        />
        <div className="login__options">
          <Checkbox
            id="remember"
            label="Lembre de mim"
            checked={form.remember}
            onChange={(remember) => setForm((current) => ({ ...current, remember }))}
          />
          <TextLink to={paths.forgotPassword}>Esqueceu sua senha?</TextLink>
        </div>
        <Button type="submit" fullWidth disabled={!canSubmit || status.loading}>
          {status.loading ? 'Entrando...' : 'Começar'}
        </Button>
        {status.error && <StatusMessage tone="alert">{status.error}</StatusMessage>}
      </form>
    </AuthPage>
  )
}
