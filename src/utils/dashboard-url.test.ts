import { describe, expect, it } from 'vitest'
import { buildDashboardUrl } from './dashboard-url'

const BASE_URL =
  'https://dbc-6306c3f9-2fb0.cloud.databricks.com/dashboardsv3/01f1d2e7b80c15809a2b55d05965ee87/published?o=7474654296617676'

const COMPANY_PARAM = 'f_b445d0e8~filtro_empresa.s'
const UNIT_PARAM = 'f_b445d0e8~filtro_filial.s'

describe('buildDashboardUrl', () => {
  it('gera a mesma URL publicada pelo Databricks com os filtros aplicados', () => {
    const url = buildDashboardUrl(BASE_URL, {
      [COMPANY_PARAM]: 'Âmbar Energia',
      [UNIT_PARAM]: 'UFV Âmbar Saltinho',
    })

    expect(url).toBe(
      'https://dbc-6306c3f9-2fb0.cloud.databricks.com/dashboardsv3/01f1d2e7b80c15809a2b55d05965ee87/published?o=7474654296617676&f_b445d0e8%7Efiltro_empresa.s=%25C3%2582mbar%2520Energia&f_b445d0e8%7Efiltro_filial.s=UFV%2520%25C3%2582mbar%2520Saltinho',
    )
  })

  it('ignora filtros vazios ou nulos', () => {
    const url = buildDashboardUrl(BASE_URL, {
      [COMPANY_PARAM]: 'Âmbar Energia',
      [UNIT_PARAM]: null,
    })

    expect(url).toContain('filtro_empresa.s=')
    expect(url).not.toContain('filtro_filial')
    expect(buildDashboardUrl(BASE_URL, { [COMPANY_PARAM]: '   ' })).toBe(
      BASE_URL,
    )
  })

  it('substitui um filtro que já veio na URL base', () => {
    const url = buildDashboardUrl(`${BASE_URL}&${COMPANY_PARAM}=antigo`, {
      [COMPANY_PARAM]: 'Âmbar Energia',
    })

    expect(url.match(/filtro_empresa/g)).toHaveLength(1)
    expect(url).not.toContain('antigo')
  })

  it('retorna vazio quando não há URL base', () => {
    expect(buildDashboardUrl('', { [COMPANY_PARAM]: 'Âmbar Energia' })).toBe('')
  })
})
