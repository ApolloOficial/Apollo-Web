import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import reportPendingImage from '../../../../assets/images/service-order-report-pending.png'
import type { WarningDto } from '../../../../types/alert.types'
import {
  formatDate,
  formatDateTime,
  withoutCostLines,
} from '../../../../utils/formatters'
import type { ServiceOrderDto } from '../../../../types/service-order.types'
import {
  priorityLabels,
  serviceOrderStatusLabels,
} from '../../data-access/vm/ServiceOrder.vm'
import { PageLoading } from '../../../../components/page-loading'
import { useServiceOrderDetails } from '../../../../hooks/useServiceOrderData'
import { useCurrentUserContext } from '../../../../hooks/useCurrentUserContext'
import { isOperator } from '../../../../utils/user'
import { CancelServiceOrderModal } from './CancelServiceOrderModal'

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
  const { data, loading, error, reload } = useServiceOrderDetails(orderId)
  const { user } = useCurrentUserContext()
  const [cancelOpen, setCancelOpen] = useState(false)
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
        date: order.startedAt ? formatDateTime(order.startedAt) : undefined,
        tone: 'success',
      })
    }

    if (order.cancellationRequestReason) {
      items.push({
        title: 'Cancelamento solicitado',
        description: `Técnico(a) ${order.technicianName}: ${order.cancellationRequestReason}`,
        tone: 'waiting',
      })
    }

    if (order.maintenanceStatus === 'CONCLUIDA') {
      items.push({
        title: 'OS concluída',
        description: 'Laudo técnico registrado pelo técnico.',
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
    return <PageLoading />
  }

  if (!order || !warning) {
    return (
      <p className="service-orders-error" role="alert">
        {orderId === null ? 'Ordem de serviço inválida.' : error}
      </p>
    )
  }

  const canCancel =
    isOperator(user?.role) &&
    (order.maintenanceStatus === 'ABERTA' ||
      order.maintenanceStatus === 'EM_ANDAMENTO')

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

      <div className="service-order-details__title">
        <h1>OS{String(order.id).padStart(5, '0')}</h1>

        {canCancel && (
          <button
            type="button"
            className="service-order-details__cancel"
            onClick={() => setCancelOpen(true)}
          >
            Cancelar OS
          </button>
        )}
      </div>

      {canCancel && order.cancellationRequestReason && (
        <div className="service-order-cancel-request" role="status">
          <div>
            <strong>O técnico solicitou o cancelamento desta OS</strong>
            <p>Motivo: {order.cancellationRequestReason}</p>
          </div>
          <button
            type="button"
            className="service-order-details__cancel"
            onClick={() => setCancelOpen(true)}
          >
            Analisar e cancelar
          </button>
        </div>
      )}

      {cancelOpen && (
        <CancelServiceOrderModal
          orderId={order.id}
          initialReason={
            order.cancellationRequestReason
              ? `Solicitado pelo técnico: ${order.cancellationRequestReason}`
              : ''
          }
          onClose={() => setCancelOpen(false)}
          onCancelled={() => {
            setCancelOpen(false)
            reload()
          }}
        />
      )}

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
              <p>{withoutCostLines(order.technicalReport)}</p>
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
