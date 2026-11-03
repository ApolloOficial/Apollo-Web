import { hasMaxLength, isFilled, type ValidationResult } from './index'

export const JUSTIFICATION_MAX_LENGTH = 500
export const QUANTITY_MAX_LENGTH = 6

export interface InternalRelocationInput {
  quantity: string
  justification: string
}

export interface ExternalRelocationInput {
  justification: string
}

export interface InternalRelocationLookup {
  unitExists: boolean
  stringExists: boolean
}

export interface ExternalRelocationLookup {
  companyExists: boolean
  segmentExists: boolean
  panelExists: boolean
}

type InternalField = 'unit' | 'string' | 'quantity' | 'justification'
type ExternalField = 'company' | 'segment' | 'panel' | 'justification'

function validateJustification(value: string): string | null {
  if (!isFilled(value)) return 'Informe a justificativa.'
  if (!hasMaxLength(value, JUSTIFICATION_MAX_LENGTH)) {
    return `A justificativa deve ter no máximo ${JUSTIFICATION_MAX_LENGTH} caracteres.`
  }
  return null
}

export function validateInternalRelocation(
  form: InternalRelocationInput,
  lookup: InternalRelocationLookup,
): ValidationResult<InternalField> {
  const errors: Partial<Record<InternalField, string>> = {}

  if (!lookup.unitExists) {
    errors.unit = 'Selecione uma filial de destino da lista.'
  }

  if (!lookup.stringExists) {
    errors.string = 'Selecione uma string da lista.'
  }

  const quantity = Number(form.quantity)
  if (
    !isFilled(form.quantity) ||
    !Number.isInteger(quantity) ||
    quantity <= 0
  ) {
    errors.quantity = 'Informe uma quantidade inteira maior que zero.'
  }

  const justification = validateJustification(form.justification)
  if (justification) errors.justification = justification

  return { isValid: Object.keys(errors).length === 0, errors }
}

export function validateExternalRelocation(
  form: ExternalRelocationInput,
  lookup: ExternalRelocationLookup,
): ValidationResult<ExternalField> {
  const errors: Partial<Record<ExternalField, string>> = {}

  if (!lookup.companyExists) {
    errors.company = 'Selecione uma empresa de destino da lista.'
  }

  if (!lookup.segmentExists) {
    errors.segment = 'Selecione um segmento da lista.'
  }

  if (!lookup.panelExists) {
    errors.panel = 'Selecione uma placa da lista.'
  }

  const justification = validateJustification(form.justification)
  if (justification) errors.justification = justification

  return { isValid: Object.keys(errors).length === 0, errors }
}
