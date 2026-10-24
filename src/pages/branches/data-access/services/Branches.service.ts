import { request } from '../../../../services/http'
import type {
  BranchDTO,
  CreateInverterDTO,
  InverterDTO,
  InverterModelDTO,
  PageDTO,
  PanelDTO,
  StringDTO,
} from '../dto/Branches.dto'
import type { BranchFiltersVM } from '../vm/Branches.vm'

interface StringsParams {
  unitId: string
  page: number
  size: number
  status?: string
  inverterCode?: string
}

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

export function getStrings({
  unitId,
  page,
  size,
  status,
  inverterCode,
}: StringsParams) {
  const query = new URLSearchParams({
    companyUnitId: unitId,
    page: String(page),
    size: String(size),
    sortBy: 'code',
    direction: 'ASC',
  })

  if (status) {
    query.set('status', status)
  }

  if (inverterCode) {
    query.set('inverterCode', inverterCode)
  }

  return request<PageDTO<StringDTO>>(`/strings?${query}`)
}

export function getString(id: string) {
  return request<StringDTO>(`/strings/${id}`)
}

export async function getActiveStringsCount(unitId: string) {
  const result = await getStrings({
    unitId,
    page: 0,
    size: 1,
    status: 'ATIVA',
  })

  return result.totalElements
}

export function getPanels(stringId: string, page: number, size: number) {
  const query = new URLSearchParams({
    stringId,
    page: String(page),
    size: String(size),
    sortBy: 'serialNumber',
    direction: 'ASC',
  })

  return request<PageDTO<PanelDTO>>(`/panels?${query}`)
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

export function getInverter(id: string) {
  return request<InverterDTO>(`/inverters/${id}`)
}

export function getInverterModels() {
  return request<PageDTO<InverterModelDTO>>('/inverter-models?page=0&size=100')
}

export function postInverter(payload: CreateInverterDTO) {
  return request<InverterDTO>('/inverters', {
    method: 'POST',
    body: payload,
  })
}

export function simulateInverterConnectionTest() {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, 1500)
  })
}

export async function getLastReading(unitId: string, inverterCode: string) {
  const result = await getStrings({
    unitId,
    inverterCode,
    page: 0,
    size: 100,
  })

  return result.content.reduce<string | null>((latest, item) => {
    if (!item.lastMeasurementAt) return latest
    if (!latest || item.lastMeasurementAt > latest) {
      return item.lastMeasurementAt
    }
    return latest
  }, null)
}

export async function getLastReadings(inverters: InverterDTO[]) {
  const results = await Promise.allSettled(
    inverters.map((inverter) =>
      getLastReading(inverter.companyUnitId, inverter.code),
    ),
  )

  return Object.fromEntries(
    inverters.map((inverter, index) => {
      const result = results[index]

      return [
        inverter.id,
        result.status === 'fulfilled' ? result.value : null,
      ]
    }),
  ) as Record<string, string | null>
}
