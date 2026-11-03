import { request, toApiError } from './http'
import type {
  BranchDTO,
  CreateInverterDTO,
  InverterDTO,
  InverterModelDTO,
} from '../types/branch.types'
import type { BranchFiltersVM } from '../pages/branches/data-access/vm/Branches.vm'
import type { PageDto } from '../types/common.types'
import type { StringDto } from '../types/string.types'
import type { PanelDto, PanelModelDto } from '../types/panel.types'

interface StringsParams {
  unitId: string
  page: number
  size: number
  status?: string
  inverterCode?: string
}

export async function getBranches(
  filters: BranchFiltersVM,
  page: number,
  size: number,
  signal?: AbortSignal,
): Promise<PageDto<BranchDTO>> {
  try {
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

    return await request<PageDto<BranchDTO>>(`/company-units?${query}`, {
      signal,
    })
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function getBranch(id: string): Promise<BranchDTO> {
  try {
    return await request<BranchDTO>(`/company-units/${id}`)
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function getStrings(
  { unitId, page, size, status, inverterCode }: StringsParams,
  signal?: AbortSignal,
): Promise<PageDto<StringDto>> {
  try {
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

    return await request<PageDto<StringDto>>(`/strings?${query}`, { signal })
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function getString(id: string): Promise<StringDto> {
  try {
    return await request<StringDto>(`/strings/${id}`)
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function getActiveStringsCount(unitId: string): Promise<number> {
  try {
    const result = await getStrings({
      unitId,
      page: 0,
      size: 1,
      status: 'ATIVA',
    })

    return result.totalElements
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function getPanels(
  stringId: string,
  page: number,
  size: number,
): Promise<PageDto<PanelDto>> {
  try {
    const query = new URLSearchParams({
      stringId,
      page: String(page),
      size: String(size),
      sortBy: 'serialNumber',
      direction: 'ASC',
    })

    return await request<PageDto<PanelDto>>(`/panels?${query}`)
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function getInverters(
  unitId: string,
  page: number,
  size: number,
  signal?: AbortSignal,
): Promise<PageDto<InverterDTO>> {
  try {
    const query = new URLSearchParams({
      companyUnitId: unitId,
      page: String(page),
      size: String(size),
      sortBy: 'code',
      direction: 'ASC',
    })

    return await request<PageDto<InverterDTO>>(`/inverters?${query}`, {
      signal,
    })
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function getInverter(id: string): Promise<InverterDTO> {
  try {
    return await request<InverterDTO>(`/inverters/${id}`)
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function getInverterModels(): Promise<PageDto<InverterModelDTO>> {
  try {
    return await request<PageDto<InverterModelDTO>>(
      '/inverter-models?page=0&size=100',
    )
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function getPanelModels(): Promise<PageDto<PanelModelDto>> {
  try {
    return await request<PageDto<PanelModelDto>>(
      '/panel-models?page=0&size=100',
    )
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function postInverter(
  payload: CreateInverterDTO,
): Promise<InverterDTO> {
  try {
    return await request<InverterDTO>('/inverters', {
      method: 'POST',
      body: payload,
    })
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function getLastReading(
  unitId: string,
  inverterCode: string,
): Promise<string | null> {
  try {
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
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function getLastReadings(
  inverters: InverterDTO[],
): Promise<Record<string, string | null>> {
  try {
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
  } catch (cause) {
    throw toApiError(cause)
  }
}
