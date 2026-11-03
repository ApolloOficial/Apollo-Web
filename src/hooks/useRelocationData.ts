import { useMemo } from 'react'
import {
  getCompanies,
  getCompanyUnits,
  getExternalRelocation,
  getExternalRelocations,
  getIncomingInternalRelocations,
  getInternalRelocation,
  getMyInternalRelocations,
  getPanels,
  getSegments,
  getStrings,
  postExternalRelocation,
  postInternalRelocation,
  reviewExternalRelocation,
  reviewInternalRelocation,
} from '../services/relocations.service'
import type { AllFilterValue } from '../types/filter.types'
import type {
  ExternalRelocationDTO,
  InternalRelocationDTO,
  RelocationStatus,
} from '../types/relocation.types'
import { useApiResource } from './useApiResource'

const relocationActions = {
  createInternalRelocation: postInternalRelocation,
  createExternalRelocation: postExternalRelocation,
  reviewInternalRelocation,
  reviewExternalRelocation,
}

export function useRelocationActions() {
  return relocationActions
}

export type RelocationListSource =
  'my-internal' | 'incoming-internal' | 'external'

export type RelocationList =
  | { kind: 'internal'; items: InternalRelocationDTO[] }
  | { kind: 'external'; items: ExternalRelocationDTO[] }

export type RelocationDetail =
  | { type: 'INTERNAL'; item: InternalRelocationDTO }
  | { type: 'EXTERNAL'; item: ExternalRelocationDTO }

export function useRelocationList(
  source: RelocationListSource,
  status: RelocationStatus | AllFilterValue,
) {
  const fetcher = useMemo(
    () => async (): Promise<RelocationList> => {
      const params = { status, page: 0, size: 100 }

      if (source === 'my-internal') {
        return {
          kind: 'internal',
          items: (await getMyInternalRelocations(params)).content,
        }
      }

      if (source === 'incoming-internal') {
        return {
          kind: 'internal',
          items: (await getIncomingInternalRelocations(params)).content,
        }
      }

      return {
        kind: 'external',
        items: (await getExternalRelocations(params)).content,
      }
    },
    [source, status],
  )

  return useApiResource(fetcher, 'Não foi possível carregar as realocações.')
}

export function useRelocationDetail(
  type: string | undefined,
  id: string | undefined,
) {
  const fetcher = useMemo(() => {
    if (!id || (type !== 'internal' && type !== 'external')) return null

    return async (): Promise<RelocationDetail> =>
      type === 'internal'
        ? { type: 'INTERNAL', item: await getInternalRelocation(Number(id)) }
        : { type: 'EXTERNAL', item: await getExternalRelocation(Number(id)) }
  }, [type, id])

  return useApiResource(fetcher, 'Erro ao carregar detalhes.')
}

export function useRelocationFormOptions(
  unitId: string | null,
  companyId: number | null,
) {
  const fetcher = useMemo(
    () =>
      unitId
        ? async () => {
            const [units, companies, segments, strings, panels] =
              await Promise.all([
                getCompanyUnits(),
                getCompanies(),
                getSegments(),
                getStrings(unitId),
                getPanels(unitId),
              ])

            return {
              units: units.content.filter((item) => item.id !== unitId),
              companies: companies.content.filter(
                (item) => item.id !== companyId,
              ),
              segments: segments.content,
              strings: strings.content,
              panels: panels.content,
            }
          }
        : null,
    [unitId, companyId],
  )

  return useApiResource(fetcher, 'Não foi possível carregar os dados.')
}
