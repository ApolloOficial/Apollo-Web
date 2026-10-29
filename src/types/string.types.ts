export interface StringDto {
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
