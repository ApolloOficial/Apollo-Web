import { Link, NavLink } from 'react-router-dom'
import { paths } from '../../../routes/paths'
import { METRICS_DASHBOARDS } from '../data-access/config/Metrics.config'
import type { MetricsDashboardType } from '../data-access/vm/Metrics.vm'
import '../Metrics.css'
import { MetricsDashboardFrame } from './dashboard-frame'

interface Props {
  type: MetricsDashboardType
}

export function MetricsFeature({ type }: Props) {
  const dashboard = METRICS_DASHBOARDS[type]

  return (
    <section className="metrics-page">
      <nav
        className="metrics-page__breadcrumb"
        aria-label="Navegação estrutural"
      >
        <Link to={paths.home}>Início</Link>
        <span>›</span>
        <strong>Métricas</strong>
      </nav>

      <header className="metrics-page__heading">
        <h1>{dashboard.title}</h1>
        <p>{dashboard.description}</p>
      </header>

      {/* Só aparece com o menu lateral recolhido, onde os submenus somem. */}
      <nav className="metrics-page__tabs" aria-label="Tipo de métrica">
        <NavLink to={paths.metricsCorporate}>Corporativas</NavLink>
        <NavLink to={paths.metricsSolar}>Solares</NavLink>
      </nav>

      <MetricsDashboardFrame
        key={type}
        embedUrl={dashboard.embedUrl}
        title={dashboard.iframeTitle}
      />
    </section>
  )
}
