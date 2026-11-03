import {
  hasMaxLength,
  isFilled,
  isValidEmail,
  type ValidationResult,
} from './index'

export const EMAIL_MAX_LENGTH = 120
export const PASSWORD_MAX_LENGTH = 72

export interface LoginFormInput {
  email: string
  password: string
}

export function validateLoginForm(
  form: LoginFormInput,
): ValidationResult<keyof LoginFormInput> {
  const errors: Partial<Record<keyof LoginFormInput, string>> = {}

  if (!isFilled(form.email)) {
    errors.email = 'Informe seu e-mail.'
  } else if (!hasMaxLength(form.email, EMAIL_MAX_LENGTH)) {
    errors.email = `O e-mail deve ter no máximo ${EMAIL_MAX_LENGTH} caracteres.`
  } else if (!isValidEmail(form.email)) {
    errors.email = 'Informe um e-mail válido.'
  }

  if (form.password === '') {
    errors.password = 'Informe sua senha.'
  } else if (form.password.length > PASSWORD_MAX_LENGTH) {
    errors.password = `A senha deve ter no máximo ${PASSWORD_MAX_LENGTH} caracteres.`
  }

  return { isValid: Object.keys(errors).length === 0, errors }
}
