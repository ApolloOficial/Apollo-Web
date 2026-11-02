import type { PanelModelDto } from '../../../../types/panel.types'
import { findPanelModel } from '../../../../utils/validators/inverter-strings'
import type { CreateStringDto } from '../../../../types/branch.types'

export interface InverterPanelVM {
  uid: string
  serialNumber: string
  barcode: string
}

export interface InverterStringVM {
  uid: string
  mpptNumber: string
  entryNumber: string
  panelModel: string
  invoiceNumber: string
  acquisitionDt: string
  unitCost: string
  panels: InverterPanelVM[]
}

let uidCounter = 0

function createUid() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  uidCounter += 1
  return `${Date.now().toString(36)}-${uidCounter}`
}

export function createEmptyInverterPanel(): InverterPanelVM {
  return {
    uid: createUid(),
    serialNumber: '',
    barcode: '',
  }
}

export function createEmptyInverterString(): InverterStringVM {
  return {
    uid: createUid(),
    mpptNumber: '',
    entryNumber: '',
    panelModel: '',
    invoiceNumber: '',
    acquisitionDt: '',
    unitCost: '',
    panels: [createEmptyInverterPanel()],
  }
}

export function toCreateStrings(
  strings: InverterStringVM[],
  panelModels: PanelModelDto[],
): CreateStringDto[] {
  return strings.map((item) => ({
    mpptNumber: Number(item.mpptNumber),
    entryNumber: Number(item.entryNumber),
    panelModelId: findPanelModel(panelModels, item.panelModel)?.id ?? 0,
    invoiceNumber: item.invoiceNumber.trim(),
    acquisitionDt: item.acquisitionDt,
    unitCost: item.unitCost.trim() ? Number(item.unitCost) : null,
    panels: item.panels.map((panel) => ({
      serialNumber: panel.serialNumber.trim(),
      barcode: panel.barcode.trim(),
    })),
  }))
}

export { panelModelLabel } from '../../../../utils/validators/inverter-strings'
