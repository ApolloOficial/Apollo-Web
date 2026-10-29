import type { PanelModelDto } from '../../../../types/panel.types'
import type { InverterModelDTO, CreateStringDto } from '../dto/Branches.dto'

export interface InverterPanelVM {
  serialNumber: string
  barcode: string
}

export interface InverterStringVM {
  mpptNumber: string
  entryNumber: string
  panelModel: string
  invoiceNumber: string
  acquisitionDt: string
  unitCost: string
  panels: InverterPanelVM[]
}

export const EMPTY_INVERTER_PANEL: InverterPanelVM = {
  serialNumber: '',
  barcode: '',
}

export function createEmptyInverterString(): InverterStringVM {
  return {
    mpptNumber: '',
    entryNumber: '',
    panelModel: '',
    invoiceNumber: '',
    acquisitionDt: '',
    unitCost: '',
    panels: [{ ...EMPTY_INVERTER_PANEL }],
  }
}

function sameText(a: string, b: string) {
  return (
    a.trim().toLocaleLowerCase('pt-BR') === b.trim().toLocaleLowerCase('pt-BR')
  )
}

export function panelModelLabel(model: PanelModelDto) {
  return `${model.manufacturer} ${model.model}`
}

export function findPanelModel(models: PanelModelDto[], text: string) {
  return models.find((model) => sameText(panelModelLabel(model), text))
}

export function validateInverterStrings(
  strings: InverterStringVM[],
  inverterModel: InverterModelDTO,
  panelModels: PanelModelDto[],
): string {
  if (strings.length === 0) return 'Informe ao menos uma string.'

  const used = new Set<string>()

  for (const [index, item] of strings.entries()) {
    const label = `String ${index + 1}`
    const mppt = Number(item.mpptNumber)
    const entry = Number(item.entryNumber)

    if (!Number.isInteger(mppt) || mppt < 1 || mppt > inverterModel.mpptCount) {
      return `${label}: o MPPT deve ir de 1 a ${inverterModel.mpptCount}.`
    }

    if (
      !Number.isInteger(entry) ||
      entry < 1 ||
      entry > inverterModel.stringsPerMppt
    ) {
      return `${label}: a entrada deve ir de 1 a ${inverterModel.stringsPerMppt}.`
    }

    const key = `${mppt}-${entry}`

    if (used.has(key)) return `${label}: MPPT e entrada já usados nesta lista.`

    used.add(key)

    if (!findPanelModel(panelModels, item.panelModel)) {
      return `${label}: selecione um modelo de placa existente na lista.`
    }

    if (!item.invoiceNumber.trim()) return `${label}: informe a nota fiscal.`

    if (!item.acquisitionDt) return `${label}: informe a data de aquisição.`

    if (item.unitCost.trim() && !(Number(item.unitCost) >= 0)) {
      return `${label}: o custo unitário não pode ser negativo.`
    }

    if (item.panels.length === 0) return `${label}: informe ao menos uma placa.`

    if (item.panels.some((p) => !p.serialNumber.trim() || !p.barcode.trim())) {
      return `${label}: informe série e código de barras de todas as placas.`
    }
  }

  return ''
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
