export interface PageDto<T> {
    content: T[];
    totalElements: number
    totalPages: number
    size: number
    number: number
}

export type WarningSeverity = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export type WarningType =
    | 'EFICIENCIA_BAIXA'
    | 'FALHA_INVERSOR'
    | 'DANO_FISICO'
    | 'SUJIDADE'
    | 'PONTO_QUENTE'
    | 'CONEXAO'

export type WarningStatus = 'ATIVO' | 'RECONHECIDO' | 'RESOLVIDO';

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

export interface EmployeeSummaryDto {
  id: string
  fullName: string
  email: string
  role: string
  companyUnitId: string
  active: boolean
}

export interface MaintenanceTypeDto {
  id: number
  name: string
  description: string
  defaultIntervalDays: number
}

export interface ServiceOrderCreateDto {
  maintenanceTypeId: number
  technicianId: string
  dueDate: string | null
}

export interface MaintenanceRegisterDto {
  id: number
  warningId: number
  priority: WarningSeverity
  maintenanceTypeId: number
  maintenanceTypeName: string
  technicianId: string
  technicianName: string
  maintenanceStatus: string
  dueDate: string | null
}