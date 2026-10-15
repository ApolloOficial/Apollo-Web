import type { AllFilterValue } from '../../../../types/filter.types'
import type { ServiceOrderStatus } from '../dto/ServiceOrder.dto'
import type { WarningSeverity } from '../../../alerts/data-access/dto/Alerts.dto'

export type ServiceOrderPeriod = AllFilterValue | 'THIS_MONTH' | 'OVERDUE'

export interface ServiceOrderFiltersViewModel {
  id: string
  idLabel: string
  technicianName: string
  technicianId: string
  maintenanceTypeId: string | AllFilterValue
  status: ServiceOrderStatus | AllFilterValue
  period: ServiceOrderPeriod
  priority: WarningSeverity | AllFilterValue
}

export const INITIAL_SERVICE_ORDER_FILTERS: ServiceOrderFiltersViewModel = {
  id: '',
  idLabel: '',
  technicianName: '',
  technicianId: '',
  maintenanceTypeId: '',
  status: '',
  period: '',
  priority: '',
}

export const serviceOrderStatusLabels: Record<ServiceOrderStatus, string> = {
  ABERTA: 'Aberta',
  EM_ANDAMENTO: 'Em andamento',
  CONCLUIDA: 'Concluída',
  CANCELADA: 'Cancelada',
}

export const priorityLabels: Record<WarningSeverity, string> = {
  BAIXA: 'Baixa',
  MEDIA: 'Média',
  ALTA: 'Alta',
  CRITICA: 'Crítica',
}
