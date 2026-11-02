import { useMemo } from 'react'
import type { BranchFiltersVM } from '../pages/branches/data-access/vm/Branches.vm'
import {
  getActiveStringsCount,
  getBranch,
  getBranches,
  getInverter,
  getInverterModels,
  getInverters,
  getLastReading,
  getLastReadings,
  getPanels,
  getString,
  getStrings,
} from '../services/branches.service'
import type { InverterDTO } from '../types/branch.types'
import { useApiResource } from './useApiResource'

export function useBranchesPage(
  filters: BranchFiltersVM,
  page: number,
  size: number,
) {
  const fetcher = useMemo(
    () => (signal: AbortSignal) => getBranches(filters, page, size, signal),
    [filters, page, size],
  )

  return useApiResource(fetcher, 'Não foi possível carregar as filiais.')
}

export function useBranch(unitId: string | null) {
  const fetcher = useMemo(
    () => (unitId ? () => getBranch(unitId) : null),
    [unitId],
  )

  return useApiResource(
    fetcher,
    'Não foi possível carregar os dados da filial.',
  )
}

export function useActiveStringsCount(unitId: string | null) {
  const fetcher = useMemo(
    () => (unitId ? () => getActiveStringsCount(unitId) : null),
    [unitId],
  )

  return useApiResource(fetcher, 'Não foi possível contar as strings ativas.')
}

export function useInvertersPage(unitId: string, page: number, size: number) {
  const fetcher = useMemo(
    () => (signal: AbortSignal) => getInverters(unitId, page, size, signal),
    [unitId, page, size],
  )

  return useApiResource(fetcher, 'Não foi possível carregar os inversores.')
}

export function useLastReadings(inverters: InverterDTO[] | undefined) {
  const fetcher = useMemo(
    () => (inverters ? () => getLastReadings(inverters) : null),
    [inverters],
  )

  return useApiResource(fetcher, 'Não foi possível carregar as leituras.')
}

export function useInverter(id: string | undefined) {
  const fetcher = useMemo(() => (id ? () => getInverter(id) : null), [id])

  return useApiResource(fetcher, 'Não foi possível carregar o inversor.')
}

export function useInverterModels() {
  return useApiResource(
    getInverterModels,
    'Não foi possível carregar os modelos de inversor.',
  )
}

export function useLastReading(
  unitId: string | undefined,
  inverterCode: string | undefined,
) {
  const fetcher = useMemo(
    () =>
      unitId && inverterCode
        ? () => getLastReading(unitId, inverterCode)
        : null,
    [unitId, inverterCode],
  )

  return useApiResource(fetcher, 'Não foi possível carregar a última leitura.')
}

export function useInverterStrings(
  unitId: string | undefined,
  inverterCode: string | undefined,
  page: number,
  size: number,
) {
  const fetcher = useMemo(
    () =>
      unitId && inverterCode
        ? () => getStrings({ unitId, inverterCode, page, size })
        : null,
    [unitId, inverterCode, page, size],
  )

  return useApiResource(fetcher, 'Não foi possível carregar as strings.')
}

export function useStringsPage(unitId: string, page: number, size: number) {
  const fetcher = useMemo(
    () => (signal: AbortSignal) => getStrings({ unitId, page, size }, signal),
    [unitId, page, size],
  )

  return useApiResource(fetcher, 'Não foi possível carregar as strings.')
}

export function useString(id: string | undefined) {
  const fetcher = useMemo(() => (id ? () => getString(id) : null), [id])

  return useApiResource(fetcher, 'Não foi possível carregar a string.')
}

export function useStringPanels(
  id: string | undefined,
  page: number,
  size: number,
) {
  const fetcher = useMemo(
    () => (id ? () => getPanels(id, page, size) : null),
    [id, page, size],
  )

  return useApiResource(fetcher, 'Não foi possível carregar as placas.')
}
