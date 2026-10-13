import { request } from '../../../../services/http'
import type {
  WarningDto,
} from '../../../alerts/data-access/dto/Alerts.dto'
import type {
  EmployeeSummaryDto,
  MaintenanceTypeDto,
  PageDto,
  ServiceOrderDto,
  ServiceOrderListItemDto,
} from '../dto/ServiceOrder.dto'
import type {
  ServiceOrderFiltersViewModel,
} from '../vm/ServiceOrder.vm'

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

  if (filters.maintenanceTypeId) {
    query.set('maintenanceTypeId', filters.maintenanceTypeId)
  }

  if (filters.status) {
    query.set('status', filters.status)
  }

  if (filters.priority) {
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

  const content = await Promise.all(
    ordersPage.content.map(async (order) => {
      const warning = await getServiceOrderWarning(order.warningId)

      return {
        order,
        warning,
      }
    }),
  )

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

  return request<PageDto<ServiceOrderDto>>(
    `/maintenance-registers?${query}`,
  )
}

export function getServiceOrder(id: number) {
  return request<ServiceOrderDto>(
    `/maintenance-registers/${id}`,
  )
}

export function getServiceOrderWarning(warningId: number) {
  return request<WarningDto>(
    `/warnings/${warningId}`,
  )
}

export function getMaintenanceTypes() {
  return request<MaintenanceTypeDto[]>(
    '/maintenance-types',
  )
}

export function getActiveTechnicians() {
  const query = new URLSearchParams({
    role: 'TECNICO',
    isActive: 'true',
    page: '0',
    size: '100',
    sortBy: 'fullName',
    direction: 'ASC',
  })

  return request<PageDto<EmployeeSummaryDto>>(
    `/employees?${query}`,
  )
}