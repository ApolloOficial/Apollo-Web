import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AppliedFilters,
  type AppliedFilter,
} from '../../../components/applied-filters'
import { Paginator } from '../../../components/paginator'
import { Tag, type TagTone } from '../../../components/tag'
import { formatDate } from '../../../utils/formatters'
import type { WarningDto } from '../data-access/dto/Alerts.dto'
import { getWarnings } from '../data-access/services/Alerts.service'
import {
  INITIAL_ALERT_FILTERS,
  severityLabels,
  statusLabels,
  typeLabels,
  type AlertsFiltersViewModel,
} from '../data-access/vm/Alerts.vm'
import { AlertsFilters } from './filters/AlertsFilters'
import { Spinner } from '../../../components/spinner'

export type AlertsAudience = 'operator' | 'manager'

interface Props {
  audience: AlertsAudience
  initialFilters?: AlertsFiltersViewModel
}

const severityTones: Record<WarningDto['severity'], TagTone> = {
  BAIXA: 'info',
  MEDIA: 'caution',
  ALTA: 'alert',
  CRITICA: 'error',
}

export function AlertsFeature({ audience, initialFilters }: Props) {
  const [warnings, setWarnings] = useState<WarningDto[]>([])
  const [draft, setDraft] = useState<AlertsFiltersViewModel>(
    initialFilters ?? INITIAL_ALERT_FILTERS,
  )
  const [filters, setFilters] = useState<AlertsFiltersViewModel>(
    initialFilters ?? INITIAL_ALERT_FILTERS,
  )
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadWarnings = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const result = await getWarnings({
        filters,
        page,
        size,
      })

      setWarnings(result.content)
      setTotalPages(result.totalPages)
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Não foi possível carregar os alertas.',
      )
    } finally {
      setLoading(false)
    }
  }, [filters, page, size])

  useEffect(() => {
    void (async () => {
      await Promise.resolve()
      await loadWarnings()
    })()
  }, [loadWarnings])

  const appliedFilters = useMemo<AppliedFilter[]>(() => {
    const result: AppliedFilter[] = []

    if (filters.severity && filters.severity !== 'ALL') {
      result.push({
        key: 'severity',
        label: 'Severidade',
        value: severityLabels[filters.severity],
      })
    }

    if (filters.type && filters.type !== 'ALL') {
      result.push({
        key: 'type',
        label: 'Tipo/Origem',
        value: typeLabels[filters.type],
      })
    }

    if (filters.status && filters.status !== 'ALL') {
      result.push({
        key: 'status',
        label: 'Status',
        value: statusLabels[filters.status],
      })
    }

    return result
  }, [filters])

  function removeAppliedFilter(key: string) {
    setPage(0)

    if (key === 'severity') {
      setDraft((current) => ({ ...current, severity: '' }))
      setFilters((current) => ({ ...current, severity: '' }))
    }

    if (key === 'type') {
      setDraft((current) => ({ ...current, type: '' }))
      setFilters((current) => ({ ...current, type: '' }))
    }

    if (key === 'status') {
      setDraft((current) => ({ ...current, status: '' }))
      setFilters((current) => ({ ...current, status: '' }))
    }
  }

  function clearAppliedFilters() {
    setPage(0)
    setDraft(INITIAL_ALERT_FILTERS)
    setFilters(INITIAL_ALERT_FILTERS)
  }

  return (
    <main className="alerts-page list-page">
      <nav className="alerts-breadcrumb" aria-label="Navegação estrutural">
        <Link to="/">Início</Link>
        <span>›</span>
        <strong>Alertas</strong>
      </nav>

      <header>
        <h1>Alertas</h1>
        <p>Acompanhe os alertas ativos da sua filial</p>
      </header>

      <AlertsFilters
        value={draft}
        onChange={setDraft}
        onApply={() => {
          setPage(0)
          setFilters(draft)
        }}
      />

      <AppliedFilters
        filters={appliedFilters}
        onRemove={removeAppliedFilter}
        onClear={clearAppliedFilters}
      />

      {error && (
        <p className="alerts-error" role="alert">
          {error}
        </p>
      )}

      <div className="alerts-table list-table" aria-busy={loading}>
        <div
          className={
            audience === 'operator'
              ? 'alerts-table__header alerts-table__header--operator'
              : 'alerts-table__header'
          }
        >
          <strong>String / Inversor</strong>
          <strong>Placa</strong>
          <strong>Tipo/Origem</strong>
          <strong>Severidade</strong>
          <strong>Data</strong>
          <strong>Status</strong>
          {audience === 'operator' && <span />}
        </div>

        {loading && (
          <p className="alerts-table__state">
            <Spinner />
          </p>
        )}

        {!loading &&
          warnings.map((warning) => {
            const detailsPath =
              audience === 'manager'
                ? `/alerts/manager/${warning.id}`
                : `/alerts/${warning.id}`

            return (
              <article
                className={
                  audience === 'operator'
                    ? 'alerts-table__row alerts-table__row--operator'
                    : 'alerts-table__row'
                }
                key={warning.id}
              >
                <Link className="alerts-table__details" to={detailsPath}>
                  <span>
                    {warning.stringCode ?? warning.inverterCode ?? '—'}
                  </span>

                  <span>{warning.panelSerial ?? 'Todas as placas'}</span>

                  <span>{typeLabels[warning.type]}</span>

                  <Tag
                    label={severityLabels[warning.severity]}
                    tone={severityTones[warning.severity]}
                    size="sm"
                  />

                  <span>{formatDate(warning.generationDt)}</span>

                  <span
                    className={
                      warning.status === 'RESOLVIDO'
                        ? 'alerts-status alerts-status--resolved'
                        : 'alerts-status'
                    }
                  >
                    {statusLabels[warning.status]}
                  </span>
                </Link>

                {audience === 'operator' && (
                  <div className="alerts-table__action">
                    <Link
                      className="alerts-open-order"
                      to={`/alerts/${warning.id}/service-order`}
                    >
                      Abrir OS
                    </Link>
                  </div>
                )}
              </article>
            )
          })}

        {!loading && warnings.length === 0 && (
          <p className="alerts-table__state">Nenhum alerta encontrado.</p>
        )}
      </div>

      <Paginator
        page={page}
        totalPages={totalPages}
        size={size}
        onPageChange={setPage}
        onSizeChange={(newSize) => {
          setPage(0)
          setSize(newSize)
        }}
      />
    </main>
  )
}
