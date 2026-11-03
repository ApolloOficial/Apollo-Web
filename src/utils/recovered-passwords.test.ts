import { beforeEach, describe, expect, it } from 'vitest'
import {
  markPasswordRecovered,
  wasPasswordRecovered,
} from './recovered-passwords'

describe('recovered-passwords', () => {
  beforeEach(() => localStorage.clear())

  it('não marca ninguém por padrão', () => {
    expect(wasPasswordRecovered('ana@empresa.com')).toBe(false)
  })

  it('marca o e-mail ignorando caixa e espaços', () => {
    markPasswordRecovered('  Ana@Empresa.com ')

    expect(wasPasswordRecovered('ana@empresa.com')).toBe(true)
    expect(wasPasswordRecovered('ANA@EMPRESA.COM')).toBe(true)
  })

  it('não afeta outros e-mails', () => {
    markPasswordRecovered('ana@empresa.com')

    expect(wasPasswordRecovered('bia@empresa.com')).toBe(false)
  })

  it('ignora e-mail vazio', () => {
    markPasswordRecovered('   ')

    expect(wasPasswordRecovered('')).toBe(false)
    expect(localStorage.getItem('apollo:recovered-passwords')).toBeNull()
  })

  it('descarta dados de versão antiga ou corrompidos', () => {
    localStorage.setItem(
      'apollo:recovered-passwords',
      JSON.stringify({ _versao: 0, emails: ['ana@empresa.com'] }),
    )
    expect(wasPasswordRecovered('ana@empresa.com')).toBe(false)

    localStorage.setItem('apollo:recovered-passwords', '{quebrado')
    expect(wasPasswordRecovered('ana@empresa.com')).toBe(false)
  })
})
