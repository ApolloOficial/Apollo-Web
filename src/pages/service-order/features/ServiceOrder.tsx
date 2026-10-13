import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Link } from 'react-router-dom'
import {
  AppliedFilters,
  type AppliedFilter,
} from '../../../components/applied-filters'
import { Paginator } from '../../../components/paginator'
import type {
  EmployeeSummaryDto,
  MaintenanceTypeDto,
  ServiceOrderListItemDto,
} from '../data-access/dto/ServiceOrder.dto'
import {
  getActiveTechnicians,
  getMaintenanceTypes,
  getServiceOrderIds,
  getServiceOrders,
} from '../data-access/services/ServiceOrder.service'
import {
  INITIAL_SERVICE_ORDER_FILTERS,
  priorityLabels,
  serviceOrderStatusLabels,
  type ServiceOrderFiltersViewModel,
} from '../data-access/vm/ServiceOrder.vm'
import { ServiceOrderFilter } from './filters/ServiceOrderFilter'

function formatDate(value: string | null) {
  if (!value) return '—'

  return new Intl.DateTimeFormat('pt-BR').format(
    new Date(value),
  )
}

function getEquipment(item: ServiceOrderListItemDto) {
  return (
    item.warning.panelSerial ??
    item.warning.stringCode ??
    item.warning.inverterCode ??
    '—'
  )
}

function getVisualStatus(item: ServiceOrderListItemDto) {
  const { order } = item

  if (
    order.overdue &&
    order.maintenanceStatus !== 'CONCLUIDA' &&
    order.maintenanceStatus !== 'CANCELADA'
  ) {
    return {
      label: 'Atrasada',
      className: 'service-order-status--overdue',
    }
  }

  return {
    label: serviceOrderStatusLabels[order.maintenanceStatus],
    className: `service-order-status--${order.maintenanceStatus.toLowerCase()}`,
  }
}

export function ServiceOrderFeature() {
  const [items, setItems] = useState<ServiceOrderListItemDto[]>([])
  const [orderIds, setOrderIds] = useState<number[]>([])
  const [technicians, setTechnicians] = useState<
    EmployeeSummaryDto[]
  >([])
  const [maintenanceTypes, setMaintenanceTypes] = useState<
    MaintenanceTypeDto[]
  >([])

  const [draft, setDraft] = useState<ServiceOrderFiltersViewModel>(
    INITIAL_SERVICE_ORDER_FILTERS,
  )
  const [filters, setFilters] =
    useState<ServiceOrderFiltersViewModel>(
      INITIAL_SERVICE_ORDER_FILTERS,
    )

  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      getActiveTechnicians(),
      getMaintenanceTypes(),
      getServiceOrderIds(),
    ])
      .then(
        ([techniciansResult, typesResult, ordersResult]) => {
          setTechnicians(techniciansResult.content)
          setMaintenanceTypes(typesResult)
          setOrderIds(
            ordersResult.content.map((order) => order.id),
          )
        },
      )
      .catch(() => {
        setTechnicians([])
        setMaintenanceTypes([])
        setOrderIds([])
      })
  }, [])

  const loadOrders = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const result = await getServiceOrders({
        filters,
        page,
        size,
      })

      setItems(result.content)
      setTotalPages(result.totalPages)
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Não foi possível carregar as ordens de serviço.',
      )
    } finally {
      setLoading(false)
    }
  }, [filters, page, size])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    void loadOrders()
  }, [loadOrders])

  const appliedFilters = useMemo<AppliedFilter[]>(() => {
    const result: AppliedFilter[] = []

    if (filters.id) {
      result.push({
        key: 'id',
        label: 'ID',
        value:
          filters.idLabel ||
          `OS${filters.id.padStart(5, '0')}`,
      })
    }

    if (filters.technicianId) {
      result.push({
        key: 'technician',
        label: 'Técnico',
        value: filters.technicianName,
      })
    }

    if (filters.maintenanceTypeId && filters.maintenanceTypeId !== 'ALL') {
      const maintenanceType = maintenanceTypes.find(
        (item) =>
          String(item.id) === filters.maintenanceTypeId,
      )

      result.push({
        key: 'maintenanceType',
        label: 'Tipo',
        value:
          maintenanceType?.name ??
          filters.maintenanceTypeId,
      })
    }

    if (filters.status && filters.status !== 'ALL') {
      result.push({
        key: 'status',
        label: 'Status',
        value: serviceOrderStatusLabels[filters.status],
      })
    }

    if (filters.period && filters.period !== 'ALL') {
      result.push({
        key: 'period',
        label: 'Período',
        value:
          filters.period === 'THIS_MONTH'
            ? 'Este mês'
            : 'Atrasadas',
      })
    }

    if (filters.priority && filters.priority !== 'ALL') {
      result.push({
        key: 'priority',
        label: 'Prioridade',
        value: priorityLabels[filters.priority],
      })
    }

    return result
  }, [filters, maintenanceTypes])

  function removeAppliedFilter(key: string) {
    setPage(0)

    if (key === 'id') {
      setDraft((current) => ({
        ...current,
        id: '',
        idLabel: '',
      }))
      setFilters((current) => ({
        ...current,
        id: '',
        idLabel: '',
      }))
    }

    if (key === 'technician') {
      setDraft((current) => ({
        ...current,
        technicianId: '',
        technicianName: '',
      }))
      setFilters((current) => ({
        ...current,
        technicianId: '',
        technicianName: '',
      }))
    }

    if (key === 'maintenanceType') {
      setDraft((current) => ({
        ...current,
        maintenanceTypeId: '',
      }))
      setFilters((current) => ({
        ...current,
        maintenanceTypeId: '',
      }))
    }

    if (key === 'status') {
      setDraft((current) => ({
        ...current,
        status: '',
      }))
      setFilters((current) => ({
        ...current,
        status: '',
      }))
    }

    if (key === 'period') {
      setDraft((current) => ({
        ...current,
        period: '',
      }))
      setFilters((current) => ({
        ...current,
        period: '',
      }))
    }

    if (key === 'priority') {
      setDraft((current) => ({
        ...current,
        priority: '',
      }))
      setFilters((current) => ({
        ...current,
        priority: '',
      }))
    }
  }

  function clearAppliedFilters() {
    setPage(0)
    setDraft(INITIAL_SERVICE_ORDER_FILTERS)
    setFilters(INITIAL_SERVICE_ORDER_FILTERS)
  }

  return (
    <main className="service-orders-page">
      <nav
        className="service-orders-breadcrumb"
        aria-label="Navegação estrutural"
      >
        <Link to="/">Início</Link>
        <span>›</span>
        <strong>OS</strong>
      </nav>

      <header>
        <h1>Ordens de serviço</h1>
        <p>Acompanhe todas as OS.</p>
      </header>

      <ServiceOrderFilter
        value={draft}
        orderIds={orderIds}
        technicians={technicians}
        maintenanceTypes={maintenanceTypes}
        onChange={setDraft}
        onApply={() => {
          setPage(0)
          setFilters(draft)
        }}
      />

      <AppliedFilters
        filters={appliedFilters}
        onRemove={removeAppliedFilter}
        onClear={clearAppliedFilters}
      />

      {error && (
        <p className="service-orders-error" role="alert">
          {error}
        </p>
      )}

      <div
        className="service-orders-table"
        aria-busy={loading}
      >
        <div className="service-orders-table__header">
          <strong>ID</strong>
          <strong>String / Inversor / Placa</strong>
          <strong>Tipo</strong>
          <strong>Técnico</strong>
          <strong>Prioridade</strong>
          <strong>Prazo de conclusão</strong>
          <strong>Status</strong>
        </div>

        {loading && (
          <p className="service-orders-table__state">
            Carregando...
          </p>
        )}

        {!loading &&
          items.map((item) => {
            const visualStatus = getVisualStatus(item)

            return (
              <Link
                className="service-orders-table__row"
                to={`/service-orders/${item.order.id}`}
                key={item.order.id}
              >
                <span>
                  OS{String(item.order.id).padStart(5, '0')}
                </span>

                <span>{getEquipment(item)}</span>

                <span>
                  {item.order.maintenanceTypeName}
                </span>

                <span>{item.order.technicianName}</span>

                <span>
                  {priorityLabels[item.order.priority]}
                </span>

                <span>
                  {formatDate(item.order.dueDate)}
                </span>

                <span
                  className={`service-order-status ${visualStatus.className}`}
                >
                  {visualStatus.label}
                </span>
              </Link>
            )
          })}

        {!loading && items.length === 0 && (
          <p className="service-orders-table__state">
            Nenhuma ordem de serviço encontrada.
          </p>
        )}
      </div>

      <Paginator
        page={page}
        totalPages={totalPages}
        size={size}
        onPageChange={setPage}
        onSizeChange={(newSize) => {
          setPage(0)
          setSize(newSize)
        }}
      />
    </main>
  )
}