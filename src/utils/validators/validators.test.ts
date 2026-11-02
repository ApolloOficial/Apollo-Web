import { describe, expect, it } from 'vitest'
import {
  hasMaxLength,
  isFilled,
  isValidEmail,
  isValidIpv4,
  isValidPassword,
  isValidPort,
  validateServiceOrderForm,
} from '.'
import { sanitizeEmbedUrl } from './url'

describe('validators', () => {
  it('valida senha forte', () => {
    expect(isValidPassword('Apollo@2026')).toBe(true)
    expect(isValidPassword('apollo2026')).toBe(false)
  })

  it('valida e-mail', () => {
    expect(isValidEmail('gerente@apollo.com')).toBe(true)
    expect(isValidEmail('gerente@apollo')).toBe(false)
  })

  it('valida IPv4 e porta', () => {
    expect(isValidIpv4('192.168.0.10')).toBe(true)
    expect(isValidIpv4('300.1.1.1')).toBe(false)
    expect(isValidPort('8080')).toBe(true)
    expect(isValidPort('70000')).toBe(false)
  })

  it('valida preenchimento e tamanho', () => {
    expect(isFilled('  ')).toBe(false)
    expect(hasMaxLength('abc', 2)).toBe(false)
  })

  it('aceita apenas URLs https', () => {
    expect(sanitizeEmbedUrl('https://apollo.com/dash')).toBe(
      'https://apollo.com/dash',
    )
    expect(sanitizeEmbedUrl('http://apollo.com')).toBe('')
    expect(sanitizeEmbedUrl('javascript:alert(1)')).toBe('')
  })
})

describe('validateServiceOrderForm', () => {
  const today = '2026-11-01'

  it('retorna erro por campo', () => {
    const result = validateServiceOrderForm(
      { technicianName: '', maintenanceTypeId: '', dueDate: '2026-10-01' },
      false,
      today,
    )

    expect(result.isValid).toBe(false)
    expect(result.errors.maintenanceTypeId).toBeDefined()
    expect(result.errors.technicianName).toBeDefined()
    expect(result.errors.dueDate).toBeDefined()
  })

  it('aceita formulário válido', () => {
    const result = validateServiceOrderForm(
      { technicianName: 'Ana', maintenanceTypeId: '1', dueDate: '' },
      true,
      today,
    )

    expect(result).toEqual({ isValid: true, errors: {} })
  })
})
