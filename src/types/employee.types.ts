export interface RoleDTO {
  id: number
  name: string
  description: string | null
}

export interface CreateEmployeeDTO {
  fullName: string
  email: string
  temporaryPassword: string
  roleId: number
  companyUnitId: string
  active: boolean
}

export interface EmployeeDto {
  id: string
  fullName: string
  email: string
  role: string
  companyUnitId: string
  active: boolean
}
