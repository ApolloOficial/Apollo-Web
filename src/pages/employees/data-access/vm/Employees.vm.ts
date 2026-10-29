import type { AllFilterValue } from '../../../../types/filter.types'

export type ActiveFilterVM = AllFilterValue | 'true' | 'false'

export interface EmployeeFiltersVM {
  fullName: string
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
  fullName: '',
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
