import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { WarningDto } from '../data-access/dto/Alerts.dto'
import { getWarning } from '../data-access/services/Alerts.service'
import {
  severityLabels,
  statusLabels,
  typeLabels,
} from '../data-access/vm/Alerts.vm'
import { formatDate } from '../../../utils/formatters'
import '../Alerts.css'

interface Props {
  audience?: 'operator' | 'manager'
}

export default function AlertDetails({ audience = 'operator' }: Props) {
  const { id } = useParams()
  const [warning, setWarning] = useState<WarningDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadWarning = useCallback(async () => {
    if (!id || Number.isNaN(Number(id))) {
      setError('Alerta inválido.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      setWarning(await getWarning(Number(id)))
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Não foi possível carregar o alerta.',
      )
    } finally {
      setLoading(false)
    }
  }, [id])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => void loadWarning(), [loadWarning])

  if (loading) {
    return <p className="alerts-details__state">Carregando...</p>
  }

  if (!warning) {
    return (
      <p className="alerts-error" role="alert">
        {error}
      </p>
    )
  }

  const canOpenServiceOrder =
    audience === 'operator' &&
    warning.status === 'ATIVO' &&
    warning.maintenanceId === null

  return (
    <main className="alerts-details">
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
    </main>
  )
}
