import { request } from './http'
import type {
  CreateEmployeePayload,
  CurrentUser,
  Employee,
  EmployeeFilters,
  PageResponse,
  Role,
} from '../types/employee.types'

interface ListEmployeesParams extends EmployeeFilters {
  page: number
  size: number
}

export function listEmployees({ page, size, email, role, isActive }: ListEmployeesParams) {
  const query = new URLSearchParams({
    page: String(page),
    size: String(size),
    sortBy: 'fullName',
    direction: 'ASC',
  })

  if (email.trim()) query.set('email', email.trim())
  if (role.trim()) query.set('role', role.trim())
  if (isActive) query.set('isActive', isActive)

  return request<PageResponse<Employee>>(`/api/v1/employees?${query}`)
}

export function listRoles() {
  return request<PageResponse<Role>>('/api/v1/roles?page=0&size=100')
}

export function getCurrentUser() {
  return request<CurrentUser>('/api/v1/auth/me')
}

export function createEmployee(payload: CreateEmployeePayload) {
  return request<Employee>('/api/v1/employees', {
    method: 'POST',
    body: payload,
  })
}

export function deactivateEmployee(id: string) {
  return request<Employee>(`/api/v1/employees/${id}/deactivate`, {
    method: 'PATCH',
  })
}