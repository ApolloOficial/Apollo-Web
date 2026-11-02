import { request, toApiError } from './http'
import type { AllFilterValue } from '../types/filter.types'
import type {
  CompanyDTO,
  CompanyUnitDTO,
  CreateExternalRelocationDTO,
  CreateInternalRelocationDTO,
  ExternalRelocationDTO,
  InternalRelocationDTO,
  RelocationStatus,
  ReviewRelocationDTO,
  SegmentDTO,
} from '../types/relocation.types'
import type { PageDto } from '../types/common.types'
import type { StringDto } from '../types/string.types'
import type { PanelDto } from '../types/panel.types'

interface ListParams {
  status: RelocationStatus | AllFilterValue
  page: number
  size: number
}

function queryOf({ status, page, size }: ListParams) {
  const query = new URLSearchParams({
    page: String(page),
    size: String(size),
    sortBy: 'suggestedAt',
    direction: 'DESC',
  })

  if (status && status !== 'ALL') {
    query.set('status', status)
  }

  return query
}

export async function getMyInternalRelocations(
  params: ListParams,
): Promise<PageDto<InternalRelocationDTO>> {
  try {
    return await request<PageDto<InternalRelocationDTO>>(
      `/relocations/internal/mine?${queryOf(params)}`,
    )
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function getIncomingInternalRelocations(
  params: ListParams,
): Promise<PageDto<InternalRelocationDTO>> {
  try {
    return await request<PageDto<InternalRelocationDTO>>(
      `/relocations/internal/incoming?${queryOf(params)}`,
    )
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function getExternalRelocations(
  params: ListParams,
): Promise<PageDto<ExternalRelocationDTO>> {
  try {
    return await request<PageDto<ExternalRelocationDTO>>(
      `/relocations/external?${queryOf(params)}`,
    )
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function getInternalRelocation(
  id: number,
): Promise<InternalRelocationDTO> {
  try {
    return await request<InternalRelocationDTO>(`/relocations/internal/${id}`)
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function getExternalRelocation(
  id: number,
): Promise<ExternalRelocationDTO> {
  try {
    return await request<ExternalRelocationDTO>(`/relocations/external/${id}`)
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function postInternalRelocation(
  body: CreateInternalRelocationDTO,
): Promise<InternalRelocationDTO> {
  try {
    return await request<InternalRelocationDTO>('/relocations/internal', {
      method: 'POST',
      body,
    })
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function postExternalRelocation(
  body: CreateExternalRelocationDTO,
): Promise<ExternalRelocationDTO> {
  try {
    return await request<ExternalRelocationDTO>('/relocations/external', {
      method: 'POST',
      body,
    })
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function reviewInternalRelocation(
  id: number,
  body: ReviewRelocationDTO,
): Promise<InternalRelocationDTO> {
  try {
    return await request<InternalRelocationDTO>(
      `/relocations/internal/${id}/review`,
      {
        method: 'PATCH',
        body,
      },
    )
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function reviewExternalRelocation(
  id: number,
  body: ReviewRelocationDTO,
): Promise<ExternalRelocationDTO> {
  try {
    return await request<ExternalRelocationDTO>(
      `/relocations/external/${id}/review`,
      {
        method: 'PATCH',
        body,
      },
    )
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function getCompanyUnits(): Promise<PageDto<CompanyUnitDTO>> {
  try {
    return await request<PageDto<CompanyUnitDTO>>(
      '/company-units?page=0&size=100&active=true',
    )
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function getCompanies(): Promise<PageDto<CompanyDTO>> {
  try {
    return await request<PageDto<CompanyDTO>>('/companies?page=0&size=100')
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function getSegments(): Promise<PageDto<SegmentDTO>> {
  try {
    return await request<PageDto<SegmentDTO>>('/segments?page=0&size=100')
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function getStrings(unitId: string): Promise<PageDto<StringDto>> {
  try {
    const query = new URLSearchParams({
      companyUnitId: unitId,
      page: '0',
      size: '100',
    })

    return await request<PageDto<StringDto>>(`/strings?${query}`)
  } catch (cause) {
    throw toApiError(cause)
  }
}

export async function getPanels(unitId: string): Promise<PageDto<PanelDto>> {
  try {
    const query = new URLSearchParams({
      companyUnitId: unitId,
      page: '0',
      size: '100',
    })

    return await request<PageDto<PanelDto>>(`/panels?${query}`)
  } catch (cause) {
    throw toApiError(cause)
  }
}
