import { request, toApiError } from './http'
import type { CreateEmployeeDTO, RoleDTO } from '../types/employee.types'
import type { EmployeeFiltersVM } from '../pages/employees/data-access/vm/Employees.vm'
import type { PageDto } from '../types/common.types'
import type { EmployeeDto } from '../types/employee.types'

export async function getEmployees(
  filters: EmployeeFiltersVM,
  page: number,
  size: number,
  companyUnitId?: string | null,
): Promise<PageDto<EmployeeDto>> {
  try {
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

    return await request<PageDto<EmployeeDto>>(`/employees?${query}`)
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function getRoles(): Promise<PageDto<RoleDTO>> {
  try {
    return await request<PageDto<RoleDTO>>('/roles?page=0&size=100')
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function postEmployee(
  payload: CreateEmployeeDTO,
): Promise<EmployeeDto> {
  try {
    return await request<EmployeeDto>('/employees', {
      method: 'POST',
      body: payload,
    })
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function patchDeactivateEmployee(
  id: string,
): Promise<EmployeeDto> {
  try {
    return await request<EmployeeDto>(`/employees/${id}/deactivate`, {
      method: 'PATCH',
    })
  } catch (cause) {
    throw toApiError(cause)
  }
}
