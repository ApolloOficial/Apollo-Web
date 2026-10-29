import type {
  WarningDto,
  WarningSeverity,
  WarningType,
} from '../../../alerts/data-access/dto/Alerts.dto'

export type ServiceOrderStatus =
  'ABERTA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA'

export interface ServiceOrderDto {
  id: number
  parentMaintenanceId: number | null
  warningId: number
  warningType: WarningType
  priority: WarningSeverity
  companyUnitId: string
  maintenanceTypeId: number
  maintenanceTypeName: string
  technicianId: string
  technicianName: string
  createdById: string
  technicalReport: string | null
  maintenanceStatus: ServiceOrderStatus
  overdue: boolean
  openingDt: string
  dueDate: string | null
  concludedAt: string | null
  cancelledAt: string | null
  cancellationReason: string | null
  estimatedCost: number | null
  laborCost: number | null
  partsCost: number | null
  totalCost: number | null
}

export interface ServiceOrderListItemDto {
  order: ServiceOrderDto
  warning: WarningDto
}
