import type {
  WarningSeverity,
  WarningStatus,
  WarningType,
} from '../dto/Alerts.dto'
import type { AllFilterValue } from '../../../../types/filter.types'

export interface AlertsFiltersViewModel {
  severity: WarningSeverity | AllFilterValue
  type: WarningType | AllFilterValue
  status: WarningStatus | AllFilterValue
}

export const INITIAL_ALERT_FILTERS: AlertsFiltersViewModel = {
  severity: '',
  type: '',
  status: '',
}

export const severityLabels: Record<WarningSeverity, string> = {
  BAIXA: 'Baixa',
  MEDIA: 'Média',
  ALTA: 'Alta',
  CRITICA: 'Crítica',
}

export const statusLabels: Record<WarningStatus, string> = {
  ATIVO: 'Ativo',
  RECONHECIDO: 'Reconhecido',
  RESOLVIDO: 'Resolvido',
}

export const typeLabels: Record<WarningType, string> = {
  EFICIENCIA_BAIXA: 'Eficiência baixa',
  FALHA_INVERSOR: 'Falha no inversor',
  DANO_FISICO: 'Dano físico',
  SUJIDADE: 'Sujidade',
  PONTO_QUENTE: 'Ponto quente',
  CONEXAO: 'Conexão',
}
