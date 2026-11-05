import { request, toApiError } from './http'
import { ROLE } from '../utils/user'
import type { WarningDto } from '../types/alert.types'
import type {
  ServiceOrderDto,
  ServiceOrderListItemDto,
} from '../types/service-order.types'
import type { ServiceOrderFiltersViewModel } from '../pages/service-order/data-access/vm/ServiceOrder.vm'
import type { PageDto } from '../types/common.types'
import type { EmployeeDto } from '../types/employee.types'
import type { MaintenanceTypeDto } from '../types/service-order.types'

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
  try {
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
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function getServiceOrderIds(): Promise<PageDto<ServiceOrderDto>> {
  try {
    const query = new URLSearchParams({
      page: '0',
      size: '100',
      sortBy: 'openingDt',
      direction: 'DESC',
    })

    return await request<PageDto<ServiceOrderDto>>(
      `/maintenance-registers?${query}`,
    )
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function getServiceOrder(id: number): Promise<ServiceOrderDto> {
  try {
    return await request<ServiceOrderDto>(`/maintenance-registers/${id}`)
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function cancelServiceOrder(
  id: number,
  reason: string,
): Promise<ServiceOrderDto> {
  try {
    return await request<ServiceOrderDto>(
      `/maintenance-registers/${id}/cancel`,
      { method: 'PATCH', body: { reason } },
    )
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function getServiceOrderWarning(
  warningId: number,
): Promise<WarningDto> {
  try {
    return await request<WarningDto>(`/warnings/${warningId}`)
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function getMaintenanceTypes(): Promise<MaintenanceTypeDto[]> {
  try {
    return await request<MaintenanceTypeDto[]>('/maintenance-types')
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function getActiveTechnicians(
  companyUnitId?: string | null,
): Promise<PageDto<EmployeeDto>> {
  try {
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

    return await request<PageDto<EmployeeDto>>(`/employees?${query}`)
  } catch (cause) {
    throw toApiError(cause)
  }
}
