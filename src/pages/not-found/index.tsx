import { AuthPage } from '../../components/auth-page'
import { ButtonLink } from '../../components/button'
import { paths } from '../../routes/paths'
import './NotFound.css'

export default function NotFound() {
  return (
    <AuthPage
      align="center"
      focusTitle
      illustration={
        <p className="not-found__code" aria-hidden="true">
          404
        </p>
      }
      title="Página não encontrada"
      subtitle="O endereço acessado não existe ou foi removido."
    >
      <div className="not-found__actions">
        <ButtonLink to={paths.home} fullWidth>
          Voltar ao início
        </ButtonLink>
      </div>
    </AuthPage>
  )
}
