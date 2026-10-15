export interface PageDTO<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

export interface AddressDTO {
  id: number
  streetName: string
  number: string
  additionalInfo: string | null
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

export interface BranchDTO {
  id: string
  companyId: number
  segmentId: number
  segmentName: string
  address: AddressDTO
  name: string
  createdAt: string
  email: string
  phone: string
  cnpj: string
  responsibleEmployeeId: string | null
  responsibleEmployeeName: string | null
  contactEmail: string | null
  contactPhone: string | null
  kwpTotal: number | null
  active: boolean
  activeInvertersCount?: number | null
  openServiceOrdersCount?: number | null
}

export type InverterStatus = 'ATIVO' | 'INATIVO' | 'MANUTENCAO'

export interface InverterDTO {
  id: string
  companyUnitId: string
  companyUnitName: string
  inverterModelId: number
  brand: string
  model: string
  code: string
  serialNumber: string
  status: InverterStatus
  installedAt: string
  stringsCount: number
}
