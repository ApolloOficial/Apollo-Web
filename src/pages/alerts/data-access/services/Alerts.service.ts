import { request } from '../../../../services/http'
import { ROLE } from '../../../../utils/user'
import type {
  MaintenanceRegisterDto,
  ServiceOrderCreateDto,
  WarningDto,
} from '../dto/Alerts.dto'
import type { AlertsFiltersViewModel } from '../vm/Alerts.vm'
import type { PageDto } from '../../../../types/common.types'
import type { EmployeeDto } from '../../../../types/employee.types'
import type { MaintenanceTypeDto } from '../../../../types/service-order.types'

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

  query.set('excludeResolved', 'true')

  return query
}

export function getWarnings(params: GetWarningsParams) {
  const query = createWarningsQuery(params)

  return request<PageDto<WarningDto>>(`/warnings?${query}`)
}

export function getWarning(id: number) {
  return request<WarningDto>(`/warnings/${id}`)
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

export function getMaintenanceTypes() {
  return request<MaintenanceTypeDto[]>('/maintenance-types')
}

export function postServiceOrder(
  warningId: number,
  body: ServiceOrderCreateDto,
) {
  return request<MaintenanceRegisterDto>(
    `/warnings/${warningId}/service-order`,
    {
      method: 'POST',
      body,
    },
  )
}
