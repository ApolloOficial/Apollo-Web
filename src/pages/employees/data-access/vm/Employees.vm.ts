export type ActiveFilterVM = '' | 'true' | 'false'

export interface EmployeeFiltersVM {
  email: string
  role: string
  isActive: ActiveFilterVM
}

export interface EmployeeFormVM {
  fullName: string
  email: string
  temporaryPassword: string
  roleName: string
}

export const INITIAL_EMPLOYEE_FILTERS: EmployeeFiltersVM = {
  email: '',
  role: '',
  isActive: '',
}

export const INITIAL_EMPLOYEE_FORM: EmployeeFormVM = {
  fullName: '',
  email: '',
  temporaryPassword: '',
  roleName: '',
}