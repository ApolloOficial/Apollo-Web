import type { ServiceOrderDto } from '../../../service-order/data-access/dto/ServiceOrder.dto'

export type WarningSeverity = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA'

export type WarningType =
  | 'EFICIENCIA_BAIXA'
  | 'FALHA_INVERSOR'
  | 'DANO_FISICO'
  | 'SUJIDADE'
  | 'PONTO_QUENTE'
  | 'CONEXAO'

export type WarningStatus = 'ATIVO' | 'RECONHECIDO' | 'RESOLVIDO'

export interface WarningDto {
  id: number
  stringId: string | null
  stringCode: string | null
  inverterCode: string | null
  panelId: number | null
  panelSerial: string | null
  companyUnitId: string
  type: WarningType
  severity: WarningSeverity
  status: WarningStatus
  message: string
  reportedBy: string | null
  generationDt: string
  resolvedAt: string | null
  maintenanceId: number | null
}

export interface ServiceOrderCreateDto {
  maintenanceTypeId: number
  technicianId: string
  dueDate: string | null
}

export type MaintenanceRegisterDto = ServiceOrderDto
