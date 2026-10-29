import { request } from '../../../../services/http'
import { ROLE } from '../../../../utils/user'
import type { WarningDto } from '../../../alerts/data-access/dto/Alerts.dto'
import type {
  ServiceOrderDto,
  ServiceOrderListItemDto,
} from '../dto/ServiceOrder.dto'
import type { ServiceOrderFiltersViewModel } from '../vm/ServiceOrder.vm'
import type { PageDto } from '../../../../types/common.types'
import type { EmployeeDto } from '../../../../types/employee.types'
import type { MaintenanceTypeDto } from '../../../../types/service-order.types'

interface GetServiceOrdersParams {
  filters: ServiceOrderFiltersViewModel
  page: number
  size: number
}

function createServiceOrderQuery({
  filters,
  page,
  size,
}: GetServiceOrdersParams) {
  const query = new URLSearchParams({
    page: String(page),
    size: String(size),
    sortBy: 'openingDt',
    direction: 'DESC',
  })

  if (filters.id.trim()) {
    query.set('id', filters.id.trim())
  }

  if (filters.technicianId) {
    query.set('technicianId', filters.technicianId)
  }

  if (filters.maintenanceTypeId && filters.maintenanceTypeId !== 'ALL') {
    query.set('maintenanceTypeId', filters.maintenanceTypeId)
  }

  if (filters.status && filters.status !== 'ALL') {
    query.set('status', filters.status)
  }

  if (filters.priority && filters.priority !== 'ALL') {
    query.set('priority', filters.priority)
  }

  if (filters.period === 'THIS_MONTH') {
    query.set('thisMonth', 'true')
  }

  if (filters.period === 'OVERDUE') {
    query.set('overdue', 'true')
  }

  return query
}

export async function getServiceOrders({
  filters,
  page,
  size,
}: GetServiceOrdersParams): Promise<PageDto<ServiceOrderListItemDto>> {
  const query = createServiceOrderQuery({
    filters,
    page,
    size,
  })

  const ordersPage = await request<PageDto<ServiceOrderDto>>(
    `/maintenance-registers?${query}`,
  )

  const warningIds = [
    ...new Set(ordersPage.content.map((order) => order.warningId)),
  ]
  const warnings = new Map(
    await Promise.all(
      warningIds.map(
        async (id) => [id, await getServiceOrderWarning(id)] as const,
      ),
    ),
  )

  const content = ordersPage.content.flatMap((order) => {
    const warning = warnings.get(order.warningId)

    return warning ? [{ order, warning }] : []
  })

  return {
    ...ordersPage,
    content,
  }
}

export function getServiceOrderIds() {
  const query = new URLSearchParams({
    page: '0',
    size: '100',
    sortBy: 'openingDt',
    direction: 'DESC',
  })

  return request<PageDto<ServiceOrderDto>>(`/maintenance-registers?${query}`)
}

export function getServiceOrder(id: number) {
  return request<ServiceOrderDto>(`/maintenance-registers/${id}`)
}

export function getServiceOrderWarning(warningId: number) {
  return request<WarningDto>(`/warnings/${warningId}`)
}

export function getMaintenanceTypes() {
  return request<MaintenanceTypeDto[]>('/maintenance-types')
}

export function getActiveTechnicians(companyUnitId?: string | null) {
  const query = new URLSearchParams({
    role: ROLE.TECHNICIAN,
    isActive: 'true',
    page: '0',
    size: '100',
    sortBy: 'fullName',
    direction: 'ASC',
  })

  if (companyUnitId) {
    query.set('companyUnitId', companyUnitId)
  }

  return request<PageDto<EmployeeDto>>(`/employees?${query}`)
}
