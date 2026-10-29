import { request } from '../../../../services/http'
import type { AllFilterValue } from '../../../../types/filter.types'
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
} from '../dto/Relocations.dto'
import type { PageDto } from '../../../../types/common.types'
import type { StringDto } from '../../../../types/string.types'
import type { PanelDto } from '../../../../types/panel.types'

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

export function getMyInternalRelocations(params: ListParams) {
  return request<PageDto<InternalRelocationDTO>>(
    `/relocations/internal/mine?${queryOf(params)}`,
  )
}

export function getIncomingInternalRelocations(params: ListParams) {
  return request<PageDto<InternalRelocationDTO>>(
    `/relocations/internal/incoming?${queryOf(params)}`,
  )
}

export function getExternalRelocations(params: ListParams) {
  return request<PageDto<ExternalRelocationDTO>>(
    `/relocations/external?${queryOf(params)}`,
  )
}

export function getInternalRelocation(id: number) {
  return request<InternalRelocationDTO>(`/relocations/internal/${id}`)
}

export function getExternalRelocation(id: number) {
  return request<ExternalRelocationDTO>(`/relocations/external/${id}`)
}

export function postInternalRelocation(body: CreateInternalRelocationDTO) {
  return request<InternalRelocationDTO>('/relocations/internal', {
    method: 'POST',
    body,
  })
}

export function postExternalRelocation(body: CreateExternalRelocationDTO) {
  return request<ExternalRelocationDTO>('/relocations/external', {
    method: 'POST',
    body,
  })
}

export function reviewInternalRelocation(
  id: number,
  body: ReviewRelocationDTO,
) {
  return request<InternalRelocationDTO>(`/relocations/internal/${id}/review`, {
    method: 'PATCH',
    body,
  })
}

export function reviewExternalRelocation(
  id: number,
  body: ReviewRelocationDTO,
) {
  return request<ExternalRelocationDTO>(`/relocations/external/${id}/review`, {
    method: 'PATCH',
    body,
  })
}

export function getCompanyUnits() {
  return request<PageDto<CompanyUnitDTO>>(
    '/company-units?page=0&size=100&active=true',
  )
}

export function getCompanies() {
  return request<PageDto<CompanyDTO>>('/companies?page=0&size=100')
}

export function getSegments() {
  return request<PageDto<SegmentDTO>>('/segments?page=0&size=100')
}

export function getStrings(unitId: string) {
  const query = new URLSearchParams({
    companyUnitId: unitId,
    page: '0',
    size: '100',
  })

  return request<PageDto<StringDto>>(`/strings?${query}`)
}

export function getPanels(unitId: string) {
  const query = new URLSearchParams({
    companyUnitId: unitId,
    page: '0',
    size: '100',
  })

  return request<PageDto<PanelDto>>(`/panels?${query}`)
}
