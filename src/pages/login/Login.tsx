import { useState } from 'react'
import type { FormEvent } from 'react'
import { AuthPage } from '../../components/auth-page'
import { Button } from '../../components/button'
import { MailIcon } from '../../components/icons/mail-icon'
import { Checkbox } from '../../components/inputs/checkbox'
import { PasswordInput } from '../../components/inputs/password-input'
import { SimpleInput } from '../../components/inputs/simple-input'
import { TextLink } from '../../components/text-link'
import { paths } from '../../routes/paths'
import type { LoginFormValues } from '../../types/auth.types'
import './Login.css'

const initialForm: LoginFormValues = {
  email: '',
  password: '',
  remember: false,
}

export default function Login() {
  const [form, setForm] = useState<LoginFormValues>(initialForm)

  const canSubmit = form.email.trim() !== '' && form.password !== ''

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
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
        />
        <PasswordInput
          id="password"
          label="Senha"
          placeholder="Digite aqui sua senha"
          autoComplete="current-password"
          value={form.password}
          onChange={(password) => setForm((current) => ({ ...current, password }))}
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
        <Button type="submit" fullWidth disabled={!canSubmit}>
          Começar
        </Button>
      </form>
    </AuthPage>
  )
}
