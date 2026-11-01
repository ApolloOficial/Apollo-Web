import { ButtonLink } from '../../components/button'
import { paths } from '../../routes/paths'
import './Welcome.css'

export default function Welcome() {
  return (
    <section className="welcome">
      <h1 className="welcome__title">
        Otimize com <span className="welcome__highlight">Apollo!</span>
      </h1>
      <p className="welcome__text">
        Seja bem vindo. Gerencie a eficiência da sua fazenda solar com métricas
        avançadas e análises preditivas de ponta. Para o seu negócio.
      </p>
      <div className="welcome__actions">
        <ButtonLink to={paths.login} fullWidth>
          Comece agora
        </ButtonLink>
      </div>
    </section>
  )
}
