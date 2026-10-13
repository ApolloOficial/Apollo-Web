import { request } from '../../../../services/http'
import type {
  EmployeeSummaryDto,
  MaintenanceRegisterDto,
  MaintenanceTypeDto,
  PageDto,
  ServiceOrderCreateDto,
  WarningDto,
} from '../dto/Alerts.dto'
import type { AlertsFiltersViewModel } from '../vm/Alerts.vm'

interface GetWarningsParams {
  filters: AlertsFiltersViewModel
  page: number
  size: number
}

export function getWarnings({
  filters,
  page,
  size,
}: GetWarningsParams) {
  const query = new URLSearchParams({
    page: String(page),
    size: String(size),
    sortBy: 'generationDt',
    direction: 'DESC',
  })

  if (filters.severity) query.set('severity', filters.severity)
  if (filters.type) query.set('type', filters.type)
  if (filters.status) query.set('status', filters.status)

  return request<PageDto<WarningDto>>(`/warnings?${query}`)
}

export function getWarning(id: number) {
  return request<WarningDto>(`/warnings/${id}`)
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

  return request<PageDto<EmployeeSummaryDto>>(`/employees?${query}`)
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