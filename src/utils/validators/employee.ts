import {
  hasMaxLength,
  isFilled,
  isValidEmail,
  isValidPassword,
  PASSWORD_RULES_MESSAGE,
  type ValidationResult,
} from './index'

export const EMPLOYEE_NAME_MAX_LENGTH = 120
export const EMPLOYEE_EMAIL_MAX_LENGTH = 120

export interface EmployeeFormInput {
  fullName: string
  email: string
  temporaryPassword: string
  roleName: string
}

export function validateEmployeeForm(
  form: EmployeeFormInput,
  roleExists: boolean,
): ValidationResult<keyof EmployeeFormInput> {
  const errors: Partial<Record<keyof EmployeeFormInput, string>> = {}

  if (!isFilled(form.fullName)) {
    errors.fullName = 'Informe o nome do funcionário.'
  } else if (!hasMaxLength(form.fullName, EMPLOYEE_NAME_MAX_LENGTH)) {
    errors.fullName = `O nome deve ter no máximo ${EMPLOYEE_NAME_MAX_LENGTH} caracteres.`
  }

  if (!isFilled(form.email)) {
    errors.email = 'Informe o e-mail do funcionário.'
  } else if (!hasMaxLength(form.email, EMPLOYEE_EMAIL_MAX_LENGTH)) {
    errors.email = `O e-mail deve ter no máximo ${EMPLOYEE_EMAIL_MAX_LENGTH} caracteres.`
  } else if (!isValidEmail(form.email)) {
    errors.email = 'Informe um e-mail válido.'
  }

  if (form.temporaryPassword === '') {
    errors.temporaryPassword = 'Informe a senha temporária.'
  } else if (!isValidPassword(form.temporaryPassword)) {
    errors.temporaryPassword = PASSWORD_RULES_MESSAGE
  }

  if (!roleExists) {
    errors.roleName = 'Selecione um cargo existente na lista.'
  }

  return { isValid: Object.keys(errors).length === 0, errors }
}
