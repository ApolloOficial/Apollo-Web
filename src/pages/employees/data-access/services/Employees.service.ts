import { request } from '../../../../services/http'
import type {
  CreateEmployeeDTO,
  RoleDTO,
} from '../dto/Employees.dto'
import type { EmployeeFiltersVM } from '../vm/Employees.vm'
import type { PageDto } from '../../../../types/common.types'
import type { EmployeeDto } from '../../../../types/employee.types'

export function getEmployees(
  filters: EmployeeFiltersVM,
  page: number,
  size: number,
  companyUnitId?: string | null,
) {
  const query = new URLSearchParams({
    page: String(page),
    size: String(size),
    sortBy: 'fullName',
    direction: 'ASC',
  })

  if (companyUnitId) {
    query.set('companyUnitId', companyUnitId)
  }

  if (filters.fullName.trim()) {
    query.set('fullName', filters.fullName.trim())
  }

  if (filters.email.trim()) {
    query.set('email', filters.email.trim())
  }

  if (filters.role.trim()) {
    query.set('role', filters.role.trim())
  }

  if (filters.isActive && filters.isActive !== 'ALL') {
    query.set('isActive', filters.isActive)
  }

  return request<PageDto<EmployeeDto>>(`/employees?${query}`)
}

export function getRoles() {
  return request<PageDto<RoleDTO>>('/roles?page=0&size=100')
}

export function postEmployee(payload: CreateEmployeeDTO) {
  return request<EmployeeDto>('/employees', {
    method: 'POST',
    body: payload,
  })
}

export function patchDeactivateEmployee(id: string) {
  return request<EmployeeDto>(`/employees/${id}/deactivate`, {
    method: 'PATCH',
  })
}
