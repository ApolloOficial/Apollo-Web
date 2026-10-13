import type {
  AllFilterValue,
} from '../../../../types/filter.types'
import type {
  RelocationStatus,
  RelocationType,
} from '../dto/Relocations.dto'

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