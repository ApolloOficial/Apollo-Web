import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import reportPendingImage from '../../../../assets/images/service-order-report-pending.png'
import type { WarningDto } from '../../../alerts/data-access/dto/Alerts.dto'
import type { ServiceOrderDto } from '../../data-access/dto/ServiceOrder.dto'
import {
  getServiceOrder,
  getServiceOrderWarning,
} from '../../data-access/services/ServiceOrder.service'
import {
  priorityLabels,
  serviceOrderStatusLabels,
} from '../../data-access/vm/ServiceOrder.vm'

interface HistoryItem {
  title: string
  description: string
  date?: string
  tone: 'success' | 'waiting' | 'cancelled'
}

function formatDate(value: string | null, includeTime = false) {
  if (!value) return '—'

  const date = new Date(value)

  if (includeTime) {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(date)
  }

  return new Intl.DateTimeFormat('pt-BR').format(date)
}

function getEquipment(warning: WarningDto) {
  return (
    warning.panelSerial ?? warning.stringCode ?? warning.inverterCode ?? '—'
  )
}

function getVisualStatus(order: ServiceOrderDto) {
  if (
    order.overdue &&
    order.maintenanceStatus !== 'CONCLUIDA' &&
    order.maintenanceStatus !== 'CANCELADA'
  ) {
    return 'Atrasada'
  }

  return serviceOrderStatusLabels[order.maintenanceStatus]
}

export function ServiceOrderDetailsFeature() {
  const { id } = useParams()

  const [order, setOrder] = useState<ServiceOrderDto | null>(null)
  const [warning, setWarning] = useState<WarningDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDetails = useCallback(async () => {
    if (!id || Number.isNaN(Number(id))) {
      setError('Ordem de serviço inválida.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      const orderResult = await getServiceOrder(Number(id))
      const warningResult = await getServiceOrderWarning(orderResult.warningId)

      setOrder(orderResult)
      setWarning(warningResult)
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Não foi possível carregar a ordem de serviço.',
      )
    } finally {
      setLoading(false)
    }
  }, [id])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => void loadDetails(), [loadDetails])

  const history = useMemo<HistoryItem[]>(() => {
    if (!order) return []

    const items: HistoryItem[] = [
      {
        title: 'OS Criada',
        description: `Aberta a partir do alerta ${order.warningId}. Técnico(a) ${order.technicianName} atribuído.`,
        date: formatDate(order.openingDt, true),
        tone: 'success',
      },
    ]

    if (order.maintenanceStatus === 'ABERTA' && !order.cancelledAt) {
      items.push({
        title: 'Aguardando execução',
        description: 'Aguardando o técnico iniciar o serviço.',
        tone: 'waiting',
      })
    }

    if (
      order.maintenanceStatus === 'EM_ANDAMENTO' ||
      order.maintenanceStatus === 'CONCLUIDA'
    ) {
      items.push({
        title: 'Execução iniciada',
        description: `Técnico(a) ${order.technicianName} iniciou o atendimento.`,
        tone: 'success',
      })
    }

    if (order.maintenanceStatus === 'CONCLUIDA') {
      items.push({
        title: 'OS concluída',
        description: 'Laudo técnico e custos registrados pelo técnico.',
        date: formatDate(order.concludedAt, true),
        tone: 'success',
      })
    }

    if (order.maintenanceStatus === 'CANCELADA') {
      items.push({
        title: 'OS cancelada',
        description: order.cancellationReason ?? 'Ordem de serviço cancelada.',
        date: formatDate(order.cancelledAt, true),
        tone: 'cancelled',
      })
    }

    return items
  }, [order])

  if (loading) {
    return <p className="service-order-details__state">Carregando...</p>
  }

  if (!order || !warning) {
    return (
      <p className="service-orders-error" role="alert">
        {error}
      </p>
    )
  }

  return (
    <main className="service-order-details">
      <nav
        className="service-orders-breadcrumb"
        aria-label="Navegação estrutural"
      >
        <Link to="/">Início</Link>
        <span>›</span>
        <Link to="/service-orders">OS</Link>
        <span>›</span>
        <strong>Detalhes</strong>
      </nav>

      <h1>OS{String(order.id).padStart(5, '0')}</h1>

      <dl className="service-order-details__summary">
        <div>
          <dt>String / Inversor / Placa</dt>
          <dd>{getEquipment(warning)}</dd>
        </div>

        <div>
          <dt>Prioridade</dt>
          <dd>{priorityLabels[order.priority]}</dd>
        </div>

        <div>
          <dt>Tipo</dt>
          <dd>{order.maintenanceTypeName}</dd>
        </div>

        <div>
          <dt>Técnico(a) responsável</dt>
          <dd>{order.technicianName}</dd>
        </div>

        <div>
          <dt>Data de abertura</dt>
          <dd>{formatDate(order.openingDt)}</dd>
        </div>

        <div>
          <dt>Prazo de conclusão</dt>
          <dd>{formatDate(order.dueDate)}</dd>
        </div>

        <div>
          <dt>Alerta de origem</dt>
          <dd>{order.warningId}</dd>
        </div>

        <div>
          <dt>Status</dt>
          <dd
            className={
              order.maintenanceStatus === 'CONCLUIDA'
                ? 'service-order-details__completed'
                : ''
            }
          >
            {getVisualStatus(order)}
          </dd>
        </div>
      </dl>

      <div className="service-order-details__content">
        <section className="service-order-history">
          <h2>Histórico de andamento</h2>

          <ol>
            {history.map((item, index) => (
              <li
                className={`service-order-history__item service-order-history__item--${item.tone}`}
                key={`${item.title}-${index}`}
              >
                <strong>{item.title}</strong>
                <p>{item.description}</p>
                {item.date && <time>{item.date}</time>}
              </li>
            ))}
          </ol>
        </section>

        <section className="service-order-report">
          <h2>Laudo do técnico</h2>

          {order.technicalReport ? (
            <div className="service-order-report__available">
              <p>{order.technicalReport}</p>

              {order.totalCost !== null && (
                <p>
                  <strong>Custo total:</strong>{' '}
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(order.totalCost)}
                </p>
              )}
            </div>
          ) : (
            <div className="service-order-report__pending">
              <img src={reportPendingImage} alt="" />

              <h3>Laudo não disponível ainda</h3>

              <p>
                Ele ficará disponível aqui assim que o técnico concluir o
                serviço e submetê-lo pelo app.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
