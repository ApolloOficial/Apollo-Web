export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

export interface Employee {
  id: string
  fullName: string
  email: string
  role: string
  companyUnitId: string
  active: boolean
}

export interface Role {
  id: number
  name: string
  description: string | null
}

export interface CurrentUser {
  userId: string
  fullName: string
  email: string
  role: string
  companyId: number
  companyName: string
  companyUnitId: string
  companyUnitName: string
}

export interface EmployeeFilters {
  email: string
  role: string
  isActive: '' | 'true' | 'false'
}

export interface CreateEmployeePayload {
  fullName: string
  email: string
  roleId: number
  companyUnitId: string
  active: boolean
  temporaryPassword: string
}