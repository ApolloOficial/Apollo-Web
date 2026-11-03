import { useMemo } from 'react'
import type { AlertsFiltersViewModel } from '../pages/alerts/data-access/vm/Alerts.vm'
import { getWarning, getWarnings } from '../services/alerts.service'
import { useApiResource } from './useApiResource'

export function useWarningsPage(
  filters: AlertsFiltersViewModel,
  page: number,
  size: number,
) {
  const fetcher = useMemo(
    () => () => getWarnings({ filters, page, size }),
    [filters, page, size],
  )

  return useApiResource(fetcher, 'Não foi possível carregar os alertas.')
}

export function useWarning(warningId: number | null) {
  const fetcher = useMemo(
    () => (warningId === null ? null : () => getWarning(warningId)),
    [warningId],
  )

  return useApiResource(fetcher, 'Não foi possível carregar o alerta.')
}
