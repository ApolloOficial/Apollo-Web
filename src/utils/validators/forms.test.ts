import { describe, expect, it } from 'vitest'
import { validateLoginForm } from './auth'
import { validateEmployeeForm } from './employee'
import {
  validateExternalRelocation,
  validateInternalRelocation,
} from './relocation'

describe('validateLoginForm', () => {
  it('rejects empty fields with specific messages', () => {
    const result = validateLoginForm({ email: '', password: '' })

    expect(result.isValid).toBe(false)
    expect(result.errors.email).toBe('Informe seu e-mail.')
    expect(result.errors.password).toBe('Informe sua senha.')
  })

  it('rejects malformed e-mail and oversized password', () => {
    const result = validateLoginForm({
      email: 'sem-arroba',
      password: 'a'.repeat(73),
    })

    expect(result.errors.email).toBe('Informe um e-mail válido.')
    expect(result.errors.password).toContain('72')
  })

  it('accepts a valid form', () => {
    expect(
      validateLoginForm({ email: 'ana@empresa.com', password: 'Senha@123' })
        .isValid,
    ).toBe(true)
  })
})

describe('validateEmployeeForm', () => {
  const valid = {
    fullName: 'Ana Souza',
    email: 'ana@empresa.com',
    temporaryPassword: 'Senha@123',
    roleName: 'Operador',
  }

  it('accepts a valid form', () => {
    expect(validateEmployeeForm(valid, true).isValid).toBe(true)
  })

  it('reports each invalid field separately', () => {
    const result = validateEmployeeForm(
      { ...valid, fullName: ' ', email: 'x', temporaryPassword: 'fraca' },
      false,
    )

    expect(Object.keys(result.errors).sort()).toEqual([
      'email',
      'fullName',
      'roleName',
      'temporaryPassword',
    ])
  })

  it('rejects names above the maximum length', () => {
    const result = validateEmployeeForm(
      { ...valid, fullName: 'a'.repeat(121) },
      true,
    )

    expect(result.errors.fullName).toContain('120')
  })
})

describe('validateInternalRelocation', () => {
  const lookup = { unitExists: true, stringExists: true }

  it('rejects zero, negative and fractional quantities', () => {
    for (const quantity of ['0', '-2', '1.5', '']) {
      const result = validateInternalRelocation(
        { quantity, justification: 'Motivo' },
        lookup,
      )

      expect(result.errors.quantity).toBeDefined()
    }
  })

  it('requires existing unit and string and a justification', () => {
    const result = validateInternalRelocation(
      { quantity: '2', justification: '  ' },
      { unitExists: false, stringExists: false },
    )

    expect(Object.keys(result.errors).sort()).toEqual([
      'justification',
      'string',
      'unit',
    ])
  })

  it('accepts a valid request', () => {
    expect(
      validateInternalRelocation(
        { quantity: '3', justification: 'Reforço da filial' },
        lookup,
      ).isValid,
    ).toBe(true)
  })
})

describe('validateExternalRelocation', () => {
  it('requires company, segment, panel and justification', () => {
    const result = validateExternalRelocation(
      { justification: '' },
      { companyExists: false, segmentExists: false, panelExists: false },
    )

    expect(Object.keys(result.errors).sort()).toEqual([
      'company',
      'justification',
      'panel',
      'segment',
    ])
  })

  it('rejects justification above the maximum length', () => {
    const result = validateExternalRelocation(
      { justification: 'a'.repeat(501) },
      { companyExists: true, segmentExists: true, panelExists: true },
    )

    expect(result.errors.justification).toContain('500')
  })
})
