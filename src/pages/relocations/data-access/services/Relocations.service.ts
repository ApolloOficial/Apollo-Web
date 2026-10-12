import { request } from '../../../../services/http'
import type { CompanyDTO, CompanyUnitDTO, CreateExternalRelocationDTO, CreateInternalRelocationDTO,
  ExternalRelocationDTO, InternalRelocationDTO, MeDTO, PageDTO, PanelDTO,
  RelocationStatus, ReviewRelocationDTO, SegmentDTO, StringDTO } from '../dto/Relocations.dto'

interface ListParams { status?: RelocationStatus | ''; page: number; size: number }
function queryOf({ status, page, size }: ListParams) {
  const query = new URLSearchParams({ page: String(page), size: String(size), sortBy: 'suggestedAt', direction: 'DESC' })
  if (status) query.set('status', status)
  return query
}
export const getMe = () => request<MeDTO>('/api/v1/auth/me')
export const getMyInternalRelocations = (params: ListParams) => request<PageDTO<InternalRelocationDTO>>(`/api/v1/relocations/internal/mine?${queryOf(params)}`)
export const getIncomingInternalRelocations = (params: ListParams) => request<PageDTO<InternalRelocationDTO>>(`/api/v1/relocations/internal/incoming?${queryOf(params)}`)
export const getExternalRelocations = (params: ListParams) => request<PageDTO<ExternalRelocationDTO>>(`/api/v1/relocations/external?${queryOf(params)}`)
export const getInternalRelocation = (id: number) => request<InternalRelocationDTO>(`/api/v1/relocations/internal/${id}`)
export const getExternalRelocation = (id: number) => request<ExternalRelocationDTO>(`/api/v1/relocations/external/${id}`)
export const postInternalRelocation = (body: CreateInternalRelocationDTO) => request<InternalRelocationDTO>('/api/v1/relocations/internal', { method: 'POST', body })
export const postExternalRelocation = (body: CreateExternalRelocationDTO) => request<ExternalRelocationDTO>('/api/v1/relocations/external', { method: 'POST', body })
export const reviewInternalRelocation = (id: number, body: ReviewRelocationDTO) => request<InternalRelocationDTO>(`/api/v1/relocations/internal/${id}/review`, { method: 'PATCH', body })
export const reviewExternalRelocation = (id: number, body: ReviewRelocationDTO) => request<ExternalRelocationDTO>(`/api/v1/relocations/external/${id}/review`, { method: 'PATCH', body })
export const getCompanyUnits = () => request<PageDTO<CompanyUnitDTO>>('/api/v1/company-units?page=0&size=100&active=true')
export const getCompanies = () => request<PageDTO<CompanyDTO>>('/api/v1/companies?page=0&size=100')
export const getSegments = () => request<PageDTO<SegmentDTO>>('/api/v1/segments?page=0&size=100')
export const getStrings = (unitId: string) => request<PageDTO<StringDTO>>(`/api/v1/strings?companyUnitId=${unitId}&page=0&size=100`)
export const getPanels = (unitId: string) => request<PageDTO<PanelDTO>>(`/api/v1/panels?companyUnitId=${unitId}&page=0&size=100`)
