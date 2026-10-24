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

export interface StringDTO {
  id: string
  companyUnitId: string
  code: string
  inverterCode: string
  mpptNumber: number
  entryNumber: number
  invoiceNumber: string
  manufacturer: string
  model: string
  purchasedQty: number
  installedPanels: number
  nominalPowerKwp: number | null
  status: string
  healthScore: number | null
  healthCalculatedAt: string | null
  panelsOperational: number
  panelsInMaintenance: number
  panelsInStock: number
  activeWarnings: number
  lastMeasurementAt: string | null
}

export interface PanelDTO {
  id: number
  stringId: string
  stringCode: string
  inverterCode: string
  companyUnitId: string
  serialNumber: string
  barcode: string
  manufacturer: string
  model: string
  operatingStats: string
  installationDt: string | null
  activatedAt: string | null
  stringHealthScore: number | null
  activeWarnings: number
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
  strings: []
}
