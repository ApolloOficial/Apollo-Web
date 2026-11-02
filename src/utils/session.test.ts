import { beforeEach, describe, expect, it } from 'vitest'
import { clearSession, getSession, saveSession } from './session'

describe('session', () => {
  beforeEach(() => localStorage.clear())

  it('salva com a versão do schema', () => {
    saveSession({ token: 'abc', tokenType: 'Bearer' })

    expect(getSession()).toEqual({
      _versao: 1,
      token: 'abc',
      tokenType: 'Bearer',
    })
  })

  it('descarta sessão de versão antiga', () => {
    localStorage.setItem(
      'apollo:session',
      JSON.stringify({ _versao: 0, token: 'x', tokenType: 'Bearer' }),
    )

    expect(getSession()).toBeNull()
    expect(localStorage.getItem('apollo:session')).toBeNull()
  })

  it('limpa a sessão', () => {
    saveSession({ token: 'abc', tokenType: 'Bearer' })
    clearSession()

    expect(getSession()).toBeNull()
  })
})
