import type { InverterStatus } from '../dto/Branches.dto'

export type BranchesTabVM = 'all' | 'mine'

export interface BranchFiltersVM {
  name: string
  city: string
}

export const INITIAL_BRANCH_FILTERS: BranchFiltersVM = {
  name: '',
  city: '',
}

export const INVERTER_STATUS_LABELS: Record<InverterStatus, string> = {
  ATIVO: 'Ativo',
  INATIVO: 'Inativo',
  MANUTENCAO: 'Em manutenção',
}
