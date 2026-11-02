const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,72}$/

export const PASSWORD_RULES_MESSAGE =
  'A senha deve ter de 8 a 72 caracteres, com letra maiúscula, minúscula, número e caractere especial.'

export function isValidPassword(value: string) {
  return PASSWORD_PATTERN.test(value)
}

const IPV4_PATTERN =
  /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/

export function isValidIpv4(value: string) {
  return IPV4_PATTERN.test(value.trim())
}

export function isValidPort(value: string) {
  const port = value.trim()

  if (!/^\d{1,5}$/.test(port)) return false

  return Number(port) >= 1 && Number(port) <= 65535
}

export interface ValidationResult<TField extends string> {
  isValid: boolean
  errors: Partial<Record<TField, string>>
}

export function isFilled(value: string): boolean {
  return value.trim().length > 0
}

export function hasMaxLength(value: string, max: number): boolean {
  return value.trim().length <= max
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim())
}

export interface ServiceOrderFormInput {
  technicianName: string
  maintenanceTypeId: string
  dueDate: string
}

export function validateServiceOrderForm(
  form: ServiceOrderFormInput,
  technicianExists: boolean,
  today: string,
): ValidationResult<keyof ServiceOrderFormInput> {
  const errors: Partial<Record<keyof ServiceOrderFormInput, string>> = {}

  if (!isFilled(form.maintenanceTypeId)) {
    errors.maintenanceTypeId = 'Selecione o tipo de manutenção.'
  }

  if (!isFilled(form.technicianName)) {
    errors.technicianName = 'Informe o técnico responsável.'
  } else if (!technicianExists) {
    errors.technicianName = 'Selecione um técnico existente na lista.'
  }

  if (form.dueDate && form.dueDate < today) {
    errors.dueDate = 'O prazo não pode ser anterior a hoje.'
  }

  return { isValid: Object.keys(errors).length === 0, errors }
}
