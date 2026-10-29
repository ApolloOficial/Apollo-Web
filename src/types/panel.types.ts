export interface PanelDto {
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
  pmaxW: number | null
  efficiencyPct: number | null
  installedPanels: number | null
  purchasedPanels: number | null
}

export interface PanelModelDto {
  id: number
  manufacturer: string
  model: string
  pmaxW: number
  efficiencyPct: number
  warrantyYears: number
}
