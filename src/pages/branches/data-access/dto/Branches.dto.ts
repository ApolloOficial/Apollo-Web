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

export interface InverterDTO {
  id: string
  companyUnitId: string
  companyUnitName: string
  inverterModelId: number
  brand: string
  model: string
  code: string
  serialNumber: string
  status: string
  installedAt: string
  stringsCount: number
}

export interface InverterModelDTO {
  id: number
  brand: string
  model: string
  ratedPowerKw: number
  mpptCount: number
  stringsPerMppt: number
  stringCurrentMonitoring: boolean
}

export interface CreateInverterDTO {
  inverterModelId: number
  code: string
  serialNumber: string
  installedAt: string
  strings: CreateStringDto[]
}

export interface CreatePanelDto {
  serialNumber: string
  barcode: string
}

export interface CreateStringDto {
  mpptNumber: number
  entryNumber: number
  panelModelId: number
  invoiceNumber: string
  acquisitionDt: string
  unitCost: number | null
  panels: CreatePanelDto[]
}
