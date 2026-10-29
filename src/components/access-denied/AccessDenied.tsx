import { useNavigate } from 'react-router-dom'
import { paths } from '../../routes/paths'
import { clearSession } from '../../utils/session'
import { Button } from '../button'
import './AccessDenied.css'

export function AccessDenied() {
  const navigate = useNavigate()

  function handleLogout() {
    clearSession()
    navigate(paths.login, { replace: true })
  }

  return (
    <section className="access-denied" role="alert">
      <h1 className="access-denied__title">Você não tem acesso</h1>
      <p className="access-denied__text">
        O painel web não está disponível para o cargo de Técnico de Manutenção.
        Use o aplicativo mobile do Apollo.
      </p>
      <Button onClick={handleLogout}>Sair</Button>
    </section>
  )
}
