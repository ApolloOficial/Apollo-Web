export interface PageDTO<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

export interface EmployeeDTO {
  id: string
  fullName: string
  email: string
  role: string
  companyUnitId: string
  active: boolean
}

export interface RoleDTO {
  id: number
  name: string
  description: string | null
}

export interface MeDTO {
  userId: string
  fullName: string
  email: string
  role: string
  companyId: number
  companyName: string
  companyUnitId: string
  companyUnitName: string
}

export interface CreateEmployeeDTO {
  fullName: string
  email: string
  temporaryPassword: string
  roleId: number
  companyUnitId: string
  active: boolean
}