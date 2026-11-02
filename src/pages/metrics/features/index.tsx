import { Link } from 'react-router-dom'
import { useCurrentUserContext } from '../../../hooks/useCurrentUserContext'
import { paths } from '../../../routes/paths'
import { buildDashboardUrl } from '../../../utils/dashboard-url'
import { METRICS_DASHBOARD as dashboard } from '../data-access/config/Metrics.config'
import '../Metrics.css'
import { MetricsDashboardFrame } from './dashboard-frame'

export function MetricsFeature() {
  const { user, loading } = useCurrentUserContext()
  const { filterParams } = dashboard

  let dashboardUrl = dashboard.embedUrl
  let userStatus: 'loading' | 'missing' | undefined

  if (filterParams) {
    dashboardUrl = ''

    if (user?.companyName) {
      dashboardUrl = buildDashboardUrl(dashboard.embedUrl, {
        [filterParams.company]: user.companyName,
        [filterParams.unit]: user.companyUnitName,
      })
    } else {
      userStatus = loading ? 'loading' : 'missing'
    }
  }

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
        <div>
          <h1>{dashboard.title}</h1>
          <p>{dashboard.description}</p>
        </div>

        {dashboardUrl && (
          <a
            className="button button--secondary"
            href={dashboardUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir dashboard em nova aba
          </a>
        )}
      </header>

      <MetricsDashboardFrame
        embedUrl={dashboardUrl}
        title={dashboard.iframeTitle}
        userStatus={userStatus}
      />
    </section>
  )
}
