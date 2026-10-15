import { request } from '../../../../services/http'
import type { BranchDTO, InverterDTO, PageDTO } from '../dto/Branches.dto'
import type { BranchFiltersVM } from '../vm/Branches.vm'

export function getBranches(
  filters: BranchFiltersVM,
  page: number,
  size: number,
) {
  const query = new URLSearchParams({
    page: String(page),
    size: String(size),
    sortBy: 'name',
    direction: 'ASC',
    active: 'true',
  })

  if (filters.name.trim()) {
    query.set('name', filters.name.trim())
  }

  if (filters.city.trim()) {
    query.set('city', filters.city.trim())
  }

  return request<PageDTO<BranchDTO>>(`/company-units?${query}`)
}

export function getBranch(id: string) {
  return request<BranchDTO>(`/company-units/${id}`)
}

export function getInverters(unitId: string, page: number, size: number) {
  const query = new URLSearchParams({
    companyUnitId: unitId,
    page: String(page),
    size: String(size),
    sortBy: 'code',
    direction: 'ASC',
  })

  return request<PageDTO<InverterDTO>>(`/inverters?${query}`)
}
