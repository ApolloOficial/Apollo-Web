import { Link, useParams } from 'react-router-dom'
import {
  severityLabels,
  statusLabels,
  typeLabels,
} from '../data-access/vm/Alerts.vm'
import { useWarning } from '../../../hooks/useAlertData'
import { useCurrentUserContext } from '../../../hooks/useCurrentUserContext'
import { formatDate } from '../../../utils/formatters'
import { isOperator } from '../../../utils/user'
import { PageLoading } from '../../../components/page-loading'
import '../Alerts.css'

interface Props {
  audience?: 'operator' | 'manager'
}

export default function AlertDetails({ audience = 'operator' }: Props) {
  const { id } = useParams()
  const { user } = useCurrentUserContext()
  const warningId = id && !Number.isNaN(Number(id)) ? Number(id) : null
  const { data: warning, loading, error } = useWarning(warningId)

  if (warningId !== null && loading) {
    return <PageLoading />
  }

  if (!warning) {
    return (
      <p className="alerts-error" role="alert">
        {warningId === null ? 'Alerta inválido.' : error}
      </p>
    )
  }

  const canOpenServiceOrder =
    audience === 'operator' &&
    isOperator(user?.role) &&
    warning.status === 'ATIVO'

  return (
    <div className="alerts-details">
      <nav className="alerts-breadcrumb" aria-label="Navegação estrutural">
        <Link to="/">Início</Link>
        <span>›</span>
        <Link to="/alerts">Alertas</Link>
        <span>›</span>
        <strong>Detalhes</strong>
      </nav>

      <div className="alerts-details__heading">
        <div>
          <h1>Alerta</h1>

          <section className="alerts-details__description">
            <h2>Descrição</h2>
            <p>{warning.message}</p>
          </section>
        </div>

        {canOpenServiceOrder && (
          <Link
            className="alerts-details__open-order"
            to={`/alerts/${warning.id}/service-order`}
          >
            Abrir OS
          </Link>
        )}
      </div>

      <dl className="alerts-details__grid">
        <div>
          <dt>String / Inversor</dt>
          <dd>{warning.stringCode ?? warning.inverterCode ?? '—'}</dd>
        </div>

        <div>
          <dt>Placa</dt>
          <dd>{warning.panelSerial ?? 'Todas as placas'}</dd>
        </div>

        <div>
          <dt>Severidade</dt>
          <dd>{severityLabels[warning.severity]}</dd>
        </div>

        <div>
          <dt>Data</dt>
          <dd>{formatDate(warning.generationDt)}</dd>
        </div>

        <div>
          <dt>Status</dt>
          <dd>{statusLabels[warning.status]}</dd>
        </div>

        <div>
          <dt>Tipo/Origem</dt>
          <dd>{typeLabels[warning.type]}</dd>
        </div>
      </dl>
    </div>
  )
}
