import { request, toApiError } from './http'
import { ROLE } from '../utils/user'
import type {
  MaintenanceRegisterDto,
  ServiceOrderCreateDto,
  WarningDto,
} from '../types/alert.types'
import type { AlertsFiltersViewModel } from '../pages/alerts/data-access/vm/Alerts.vm'
import type { PageDto } from '../types/common.types'
import type { EmployeeDto } from '../types/employee.types'
import type { MaintenanceTypeDto } from '../types/service-order.types'

interface GetWarningsParams {
  filters: AlertsFiltersViewModel
  page: number
  size: number
}

function createWarningsQuery({ filters, page, size }: GetWarningsParams) {
  const query = new URLSearchParams({
    page: String(page),
    size: String(size),
    sortBy: 'generationDt',
    direction: 'DESC',
  })

  if (filters.severity && filters.severity !== 'ALL') {
    query.set('severity', filters.severity)
  }

  if (filters.type && filters.type !== 'ALL') {
    query.set('type', filters.type)
  }

  if (filters.status && filters.status !== 'ALL') {
    query.set('status', filters.status)
  }

  query.set('openOnly', 'true')

  return query
}

export async function getWarnings(
  params: GetWarningsParams,
): Promise<PageDto<WarningDto>> {
  try {
    const query = createWarningsQuery(params)

    return await request<PageDto<WarningDto>>(`/warnings?${query}`)
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function getWarning(id: number): Promise<WarningDto> {
  try {
    return await request<WarningDto>(`/warnings/${id}`)
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

export async function getMaintenanceTypes(): Promise<MaintenanceTypeDto[]> {
  try {
    return await request<MaintenanceTypeDto[]>('/maintenance-types')
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function postServiceOrder(
  warningId: number,
  body: ServiceOrderCreateDto,
): Promise<MaintenanceRegisterDto> {
  try {
    return await request<MaintenanceRegisterDto>(
      `/warnings/${warningId}/service-order`,
      {
        method: 'POST',
        body,
      },
    )
  } catch (cause) {
    throw toApiError(cause)
  }
}
