import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import reportPendingImage from '../../../../assets/images/service-order-report-pending.png'
import type { WarningDto } from '../../../../types/alert.types'
import { formatDate, formatDateTime } from '../../../../utils/formatters'
import type { ServiceOrderDto } from '../../../../types/service-order.types'
import {
  getServiceOrder,
  getServiceOrderWarning,
} from '../../../../services/service-orders.service'
import {
  priorityLabels,
  serviceOrderStatusLabels,
} from '../../data-access/vm/ServiceOrder.vm'
import { Spinner } from '../../../../components/spinner'
import { useApiResource } from '../../../../hooks/useApiResource'

interface ServiceOrderDetails {
  order: ServiceOrderDto
  warning: WarningDto
}

interface HistoryItem {
  title: string
  description: string
  date?: string
  tone: 'success' | 'waiting' | 'cancelled'
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

  const orderId = id && !Number.isNaN(Number(id)) ? Number(id) : null
  const fetchDetails = useMemo(
    () =>
      orderId === null
        ? null
        : async (): Promise<ServiceOrderDetails> => {
            const order = await getServiceOrder(orderId)
            const warning = await getServiceOrderWarning(order.warningId)

            return { order, warning }
          },
    [orderId],
  )
  const { data, loading, error } = useApiResource(
    fetchDetails,
    'Não foi possível carregar a ordem de serviço.',
  )
  const order = data?.order ?? null
  const warning = data?.warning ?? null

  const history = useMemo<HistoryItem[]>(() => {
    if (!order) return []

    const items: HistoryItem[] = [
      {
        title: 'OS Criada',
        description: `Aberta a partir do alerta ${order.warningId}. Técnico(a) ${order.technicianName} atribuído.`,
        date: formatDateTime(order.openingDt),
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
        date: formatDateTime(order.concludedAt),
        tone: 'success',
      })
    }

    if (order.maintenanceStatus === 'CANCELADA') {
      items.push({
        title: 'OS cancelada',
        description: order.cancellationReason ?? 'Ordem de serviço cancelada.',
        date: formatDateTime(order.cancelledAt),
        tone: 'cancelled',
      })
    }

    return items
  }, [order])

  if (orderId !== null && loading) {
    return (
      <p className="service-order-details__state">
        <Spinner />
      </p>
    )
  }

  if (!order || !warning) {
    return (
      <p className="service-orders-error" role="alert">
        {orderId === null ? 'Ordem de serviço inválida.' : error}
      </p>
    )
  }

  return (
    <div className="service-order-details">
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
    </div>
  )
}
