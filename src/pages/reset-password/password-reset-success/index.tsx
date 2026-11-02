import { AuthPage } from '../../../components/auth-page'
import { ButtonLink } from '../../../components/button'
import illustration from '../../../assets/images/password-reset-success.png'
import { paths } from '../../../routes/paths'
import './PasswordResetSuccess.css'

export function PasswordResetSuccess() {
  return (
    <AuthPage
      align="center"
      focusTitle
      illustration={
        <img
          className="password-reset-success__illustration"
          src={illustration}
          alt=""
          width={280}
          height={332}
        />
      }
      title={
        <>
          Senha redefinida
          <br />
          <span className="password-reset-success__highlight">com sucesso</span>
        </>
      }
      subtitle="Agora você já pode entrar no Apollo com sua nova senha."
    >
      <div className="password-reset-success__actions">
        <ButtonLink to={paths.login} fullWidth>
          Ir para login
        </ButtonLink>
      </div>
    </AuthPage>
  )
}
