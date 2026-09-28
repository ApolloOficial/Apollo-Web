import { AuthPage } from '../../../components/auth-page'
import { ButtonLink } from '../../../components/button'
import { StatusMessage } from '../../../components/status-message'
import { paths } from '../../../routes/paths'
import './EmailSent.css'

export function EmailSent() {
  return (
    <AuthPage
      title="Verifique seu e-mail"
      subtitle="Se existir uma conta associada a este e-mail, você receberá instruções para redefinir sua senha."
      focusTitle
    >
      <div className="email-sent__content">
        <ButtonLink to={paths.login} variant="secondary" fullWidth>
          Voltar para login
        </ButtonLink>
        <StatusMessage tone="success">
          Confira sua caixa de entrada e a pasta de spam.
        </StatusMessage>
      </div>
    </AuthPage>
  )
}
