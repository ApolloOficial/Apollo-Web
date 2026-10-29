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
