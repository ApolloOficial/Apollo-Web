import { describe, expect, it } from 'vitest'
import { getPageTitle } from './page-titles'

describe('getPageTitle', () => {
  it.each([
    ['/', 'Início'],
    ['/login', 'Entrar'],
    ['/alerts', 'Alertas'],
    ['/alerts/manager', 'Alertas'],
    ['/alerts/12', 'Detalhes do alerta'],
    ['/alerts/12/service-order', 'Abrir ordem de serviço'],
    ['/branches/inverters/new', 'Cadastrar inversor'],
    ['/branches/inverters/7', 'Detalhes do inversor'],
    ['/relocations/new', 'Solicitar realocação'],
    ['/relocations/internal/3', 'Detalhes da realocação'],
    ['/employees/new', 'Cadastrar funcionário'],
    ['/metrics', 'Métricas'],
  ])('retorna o título de %s', (pathname, title) => {
    expect(getPageTitle(pathname)).toBe(title)
  })

  it('usa o título de página não encontrada para rotas desconhecidas', () => {
    expect(getPageTitle('/nao-existe')).toBe('Página não encontrada')
  })
})
