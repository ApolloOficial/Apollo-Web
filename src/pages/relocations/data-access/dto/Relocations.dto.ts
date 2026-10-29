export type RelocationStatus =
  'PENDENTE' | 'APROVADA' | 'REJEITADA' | 'CONCLUIDA'
export type RelocationType = 'INTERNAL' | 'EXTERNAL'
export interface CompanyUnitDTO {
  id: string
  name: string
}
export interface CompanyDTO {
  id: number
  name: string
  active: boolean
}
export interface SegmentDTO {
  id: number
  name: string
  description: string | null
}
export interface InternalRelocationDTO {
  id: number
  stringId: string
  stringCode: string
  inverterCode: string
  originUnitId: string
  originUnitName: string
  quantity: number
  suggestedUnitId: string
  suggestedUnitName: string
  requestedById: string
  requestedByName: string
  reviewedById: string | null
  reviewedByName: string | null
  justification: string
  status: RelocationStatus
  suggestedAt: string
  reviewedAt: string | null
}
export interface ExternalRelocationDTO {
  id: number
  panelId: number
  panelSerial: string
  originUnitId: string
  originUnitName: string
  destinationCompanyId: number
  destinationCompanyName: string
  segmentId: number
  segmentName: string
  requestedById: string
  requestedByName: string
  reviewedById: string | null
  reviewedByName: string | null
  justification: string
  status: RelocationStatus
  suggestedAt: string
  reviewedAt: string | null
}
export interface CreateInternalRelocationDTO {
  stringId: string
  quantity: number
  suggestedUnitId: string
  justification: string
}
export interface CreateExternalRelocationDTO {
  panelId: number
  destinationCompanyId: number
  segmentId: number
  justification: string
}
export interface ReviewRelocationDTO {
  status: 'APROVADA' | 'REJEITADA'
}
