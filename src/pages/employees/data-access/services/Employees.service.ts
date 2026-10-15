import { request } from '../../../../services/http'
import type {
  CreateEmployeeDTO,
  EmployeeDTO,
  PageDTO,
  RoleDTO,
} from '../dto/Employees.dto'
import type { EmployeeFiltersVM } from '../vm/Employees.vm'

export function getEmployees(
  filters: EmployeeFiltersVM,
  page: number,
  size: number,
) {
  const query = new URLSearchParams({
    page: String(page),
    size: String(size),
    sortBy: 'fullName',
    direction: 'ASC',
  })

  if (filters.email.trim()) {
    query.set('email', filters.email.trim())
  }

  if (filters.role.trim()) {
    query.set('role', filters.role.trim())
  }

  if (filters.isActive && filters.isActive !== 'ALL') {
    query.set('isActive', filters.isActive)
  }

  return request<PageDTO<EmployeeDTO>>(`/employees?${query}`)
}

export function getRoles() {
  return request<PageDTO<RoleDTO>>('/roles?page=0&size=100')
}

export function postEmployee(payload: CreateEmployeeDTO) {
  return request<EmployeeDTO>('/employees', {
    method: 'POST',
    body: payload,
  })
}

export function patchDeactivateEmployee(id: string) {
  return request<EmployeeDTO>(`/employees/${id}/deactivate`, {
    method: 'PATCH',
  })
}
