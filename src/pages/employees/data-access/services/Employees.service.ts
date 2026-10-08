import { request } from '../../../../services/http'
import type { EmployeeFiltersVM } from '../vm/Employees.vm'
import type { CreateEmployeeDTO, EmployeeDTO, MeDTO, PageDTO, RoleDTO } from '../dto/Employees.dto'

export function getEmployees(filters: EmployeeFiltersVM, page: number, size: number) {
  const query = new URLSearchParams({ page: String(page), size: String(size), sortBy: 'fullName', direction: 'ASC' })
  if (filters.email.trim()) query.set('email', filters.email.trim())
  if (filters.role.trim()) query.set('role', filters.role.trim())
  if (filters.isActive) query.set('isActive', filters.isActive)
  return request<PageDTO<EmployeeDTO>>(`/api/v1/employees?${query}`)
}

export function getRoles() {
  return request<PageDTO<RoleDTO>>('/api/v1/roles?page=0&size=100')
}

export function getMe() {
  return request<MeDTO>('/api/v1/auth/me')
}

export function postEmployee(payload: CreateEmployeeDTO) {
  return request<EmployeeDTO>('/api/v1/employees', { method: 'POST', body: payload })
}

export function patchDeactivateEmployee(id: string) {
  return request<EmployeeDTO>(`/api/v1/employees/${id}/deactivate`, { method: 'PATCH' })
}