import { useState } from 'react'
import type { FormEvent } from 'react'
import { AuthPage } from '../../components/auth-page'
import { Button, ButtonLink } from '../../components/button'
import { MailIcon } from '../../components/icons/mail-icon'
import { SimpleInput } from '../../components/inputs/simple-input'
import { paths } from '../../routes/paths'
import type { ForgotPasswordFormValues } from '../../types/auth.types'
import { EmailSent } from './email-sent'
import './ForgotPassword.css'

const initialForm: ForgotPasswordFormValues = {
  email: '',
}

export default function ForgotPassword() {
  const [form, setForm] = useState<ForgotPasswordFormValues>(initialForm)
  const [isSent, setIsSent] = useState(false)

  const canSubmit = form.email.trim() !== ''

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSent(true)
  }

  if (isSent) return <EmailSent />

  return (
    <AuthPage
      title="Esqueci minha senha"
      subtitle="Informe seu e-mail e enviaremos um link para redefinir sua senha."
    >
      <form className="forgot-password__form" onSubmit={handleSubmit} noValidate>
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
        <div className="forgot-password__actions">
          <Button type="submit" fullWidth disabled={!canSubmit}>
            Enviar
          </Button>
          <ButtonLink to={paths.login} variant="secondary" fullWidth>
            Voltar para login
          </ButtonLink>
        </div>
      </form>
    </AuthPage>
  )
}
