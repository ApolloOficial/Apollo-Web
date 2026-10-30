import { AuthPage } from '../../components/auth-page'
import { ButtonLink } from '../../components/button'
import illustration from '../../assets/images/permission-denied.png'
import { paths } from '../../routes/paths'
import './PermissionDenied.css'

export default function PermissionDenied() {
  return (
    <AuthPage
      align="center"
      focusTitle
      illustration={
        <img
          className="permission-denied__illustration"
          src={illustration}
          alt=""
          width={200}
          height={178}
        />
      }
      title="Permissão negada"
      subtitle="Seu perfil não tem acesso ao painel web. Use o aplicativo mobile do Apollo."
    >
      <div className="permission-denied__actions">
        <ButtonLink to={paths.login} fullWidth>
          Voltar ao login
        </ButtonLink>
      </div>
    </AuthPage>
  )
}
