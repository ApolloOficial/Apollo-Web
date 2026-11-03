import { useMemo } from 'react'
import type { EmployeeFiltersVM } from '../pages/employees/data-access/vm/Employees.vm'
import {
  getEmployees,
  getRoles,
  patchDeactivateEmployee,
  postEmployee,
} from '../services/employees.service'
import { useApiResource } from './useApiResource'

const employeeActions = {
  createEmployee: postEmployee,
  deactivateEmployee: patchDeactivateEmployee,
}

export function useEmployeeActions() {
  return employeeActions
}

export function useEmployeesPage(
  filters: EmployeeFiltersVM,
  page: number,
  size: number,
  companyUnitId: string | null,
  waitingForUser: boolean,
) {
  const fetcher = useMemo(
    () =>
      waitingForUser
        ? null
        : () => getEmployees(filters, page, size, companyUnitId),
    [filters, page, size, companyUnitId, waitingForUser],
  )

  return useApiResource(fetcher, 'Não foi possível carregar os funcionários.')
}

export function useEmployeeRoles() {
  return useApiResource(getRoles, 'Não foi possível carregar os cargos.')
}
