export type BranchesTabVM = 'all' | 'mine'

export type StatusToneVM = 'success' | 'alert' | 'error' | 'muted' | 'outline'

export interface StatusVM {
  label: string
  tone: StatusToneVM
}

export interface BranchFiltersVM {
  name: string
  city: string
}

export const INITIAL_BRANCH_FILTERS: BranchFiltersVM = {
  name: '',
  city: '',
}

const STRING_STATUS: Record<string, StatusVM> = {
  ATIVA: { label: 'Ativo', tone: 'success' },
  MANUTENCAO: { label: 'Em manutenção', tone: 'alert' },
  INATIVA: { label: 'Inativo', tone: 'outline' },
  EM_ESTOQUE: { label: 'Em estoque', tone: 'muted' },
}

const PANEL_STATUS: Record<string, StatusVM> = {
  OPERACIONAL: { label: 'Em operação', tone: 'success' },
  MANUTENCAO: { label: 'Em manutenção', tone: 'alert' },
  FALHA: { label: 'Falha', tone: 'error' },
  INATIVO: { label: 'Inativo', tone: 'outline' },
  EM_ESTOQUE: { label: 'Em estoque', tone: 'muted' },
}

const INVERTER_STATUS: Record<string, StatusVM> = {
  ATIVO: { label: 'Ativo', tone: 'success' },
  MANUTENCAO: { label: 'Em manutenção', tone: 'alert' },
  INATIVO: { label: 'Inativo', tone: 'outline' },
}

function lookup(map: Record<string, StatusVM>, status: string): StatusVM {
  return map[status] ?? { label: status, tone: 'muted' }
}

export function toStringStatusVM(status: string) {
  return lookup(STRING_STATUS, status)
}

export function toPanelStatusVM(status: string) {
  return lookup(PANEL_STATUS, status)
}

export function toInverterStatusVM(status: string) {
  return lookup(INVERTER_STATUS, status)
}
