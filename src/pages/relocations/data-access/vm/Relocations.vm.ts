import type { TagTone } from '../../../../components/tag'
import type { AllFilterValue } from '../../../../types/filter.types'
import type { RelocationStatus, RelocationType } from '../dto/Relocations.dto'

export const relocationStatusLabels: Record<RelocationStatus, string> = {
  PENDENTE: 'Pendente',
  APROVADA: 'Aprovada',
  REJEITADA: 'Rejeitada',
  CONCLUIDA: 'Concluída',
}

export const relocationStatusTones: Record<RelocationStatus, TagTone> = {
  PENDENTE: 'caution',
  APROVADA: 'success',
  REJEITADA: 'error',
  CONCLUIDA: 'info',
}

export interface RelocationFiltersVM {
  status: RelocationStatus | AllFilterValue
  type: RelocationType | AllFilterValue
}

export interface RelocationListItemVM {
  id: number
  type: RelocationType
  typeLabel: 'Interna' | 'Externa'
  origin: string
  destination: string
  requester: string
  reviewer: string
  status: RelocationStatus
}

export interface InternalRelocationFormVM {
  destinationUnitName: string
  stringCode: string
  quantity: string
  justification: string
}

export interface ExternalRelocationFormVM {
  destinationCompanyName: string
  segmentName: string
  panelLabel: string
  justification: string
}

export const INITIAL_RELOCATION_FILTERS: RelocationFiltersVM = {
  status: '',
  type: '',
}

export const INITIAL_INTERNAL_FORM: InternalRelocationFormVM = {
  destinationUnitName: '',
  stringCode: '',
  quantity: '',
  justification: '',
}

export const INITIAL_EXTERNAL_FORM: ExternalRelocationFormVM = {
  destinationCompanyName: '',
  segmentName: '',
  panelLabel: '',
  justification: '',
}

const RELOCATION_STATUSES: RelocationStatus[] = [
  'PENDENTE',
  'APROVADA',
  'REJEITADA',
  'CONCLUIDA',
]

const RELOCATION_TYPES: RelocationType[] = ['INTERNAL', 'EXTERNAL']

export function relocationFiltersFromParams(
  params: URLSearchParams,
): RelocationFiltersVM {
  const status = params.get('status') as RelocationStatus | null
  const type = params.get('type') as RelocationType | null

  return {
    status: status && RELOCATION_STATUSES.includes(status) ? status : '',
    type: type && RELOCATION_TYPES.includes(type) ? type : '',
  }
}
