import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  AppliedFilters,
  type AppliedFilter,
} from '../../../components/applied-filters'
import { Paginator } from '../../../components/paginator'
import { Tag } from '../../../components/tag'
import { useCurrentUserContext } from '../../../hooks/useCurrentUserContext'
import { paths } from '../../../routes/paths'
import type {
  ExternalRelocationDTO,
  InternalRelocationDTO,
} from '../data-access/dto/Relocations.dto'
import {
  getExternalRelocations,
  getIncomingInternalRelocations,
  getMyInternalRelocations,
} from '../data-access/services/Relocations.service'
import {
  INITIAL_RELOCATION_FILTERS,
  relocationStatusLabels as statusLabels,
  relocationStatusTones,
  type RelocationFiltersVM,
  type RelocationListItemVM,
} from '../data-access/vm/Relocations.vm'
import { RelocationsFilters } from './filters/RelocationsFilters'

export type RelocationsAudience = 'operator' | 'manager'
type ManagerTab = 'others' | 'my-unit'
type OperatorTab = 'external' | 'internal'

function toInternal(item: InternalRelocationDTO): RelocationListItemVM {
  return {
    id: item.id,
    type: 'INTERNAL',
    typeLabel: 'Interna',
    origin: item.originUnitName,
    destination: item.suggestedUnitName,
    requester: item.requestedByName,
    reviewer: item.reviewedByName ?? '—',
    status: item.status,
  }
}

function toExternal(item: ExternalRelocationDTO): RelocationListItemVM {
  return {
    id: item.id,
    type: 'EXTERNAL',
    typeLabel: 'Externa',
    origin: item.originUnitName,
    destination: item.destinationCompanyName,
    requester: item.requestedByName,
    reviewer: item.reviewedByName ?? '—',
    status: item.status,
  }
}

export function RelocationsFeature({
  audience,
}: {
  audience: RelocationsAudience
}) {
  const [items, setItems] = useState<RelocationListItemVM[]>([])
  const [draft, setDraft] = useState<RelocationFiltersVM>(
    INITIAL_RELOCATION_FILTERS,
  )
  const [filters, setFilters] = useState<RelocationFiltersVM>(
    INITIAL_RELOCATION_FILTERS,
  )
  const [tab, setTab] = useState<ManagerTab>('others')
  const [searchParams, setSearchParams] = useSearchParams()
  const operatorTab: OperatorTab =
    searchParams.get('tab') === 'internal' ? 'internal' : 'external'
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // O usuário vem do contexto (uma única chamada a /auth/me no Layout).
  // Só o operador precisa dele; no gerente os valores ficam constantes para
  // não recarregar a lista quando o usuário termina de carregar.
  const { user, loading: userLoading, error: userError } =
    useCurrentUserContext()
  const isOperator = audience === 'operator'
  const operatorUserId = isOperator ? user?.userId : undefined
  const waitingUser = isOperator && userLoading
  const operatorUserError = isOperator ? userError : null

  const load = useCallback(async () => {
    if (isOperator && operatorTab === 'external' && !operatorUserId) {
      if (!waitingUser) {
        setError(
          operatorUserError ?? 'Não foi possível identificar o usuário.',
        )
        setLoading(false)
      }
      return
    }

    setLoading(true)
    setError('')

    try {
      if (isOperator && operatorTab === 'internal') {
        const result = await getMyInternalRelocations({
          status: filters.status,
          page: 0,
          size: 100,
        })

        setItems(result.content.map(toInternal))
      } else if (isOperator) {
        const result = await getExternalRelocations({
          status: filters.status,
          page: 0,
          size: 100,
        })

        setItems(
          result.content
            .filter((item) => item.requestedById === operatorUserId)
            .map(toExternal),
        )
      } else if (tab === 'my-unit') {
        const result = await getIncomingInternalRelocations({
          status: filters.status,
          page: 0,
          size: 100,
        })

        setItems(result.content.map(toInternal))
      } else {
        const result = await getExternalRelocations({
          status: filters.status,
          page: 0,
          size: 100,
        })

        setItems(result.content.map(toExternal))
      }
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Não foi possível carregar as realocações.',
      )
    } finally {
      setLoading(false)
    }
  }, [
    isOperator,
    operatorTab,
    operatorUserId,
    waitingUser,
    operatorUserError,
    filters,
    tab,
  ])

  useEffect(() => {
    void (async () => {
      await Promise.resolve()
      await load()
    })()
  }, [load])

  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          (!filters.type ||
            filters.type === 'ALL' ||
            item.type === filters.type) &&
          (!filters.status ||
            filters.status === 'ALL' ||
            item.status === filters.status),
      ),
    [filters, items],
  )

  const totalPages = Math.ceil(filtered.length / size)

  // Colunas conforme o protótipo: "Minha filial" mostra o revisor no lugar da origem.
  const layout = isOperator
    ? 'operator'
    : tab === 'my-unit'
      ? 'unit'
      : 'default'

  const visible = useMemo(
    () => filtered.slice(page * size, page * size + size),
    [filtered, page, size],
  )

  const appliedFilters = useMemo<AppliedFilter[]>(() => {
    const result: AppliedFilter[] = []

    if (filters.status && filters.status !== 'ALL') {
      result.push({
        key: 'status',
        label: 'Status',
        value: statusLabels[filters.status],
      })
    }

    if (filters.type && filters.type !== 'ALL') {
      result.push({
        key: 'type',
        label: 'Tipo',
        value: filters.type === 'INTERNAL' ? 'Interna' : 'Externa',
      })
    }

    return result
  }, [filters])
  const tabs = isOperator
    ? [
        { key: 'external', label: 'Externas' },
        { key: 'internal', label: 'Internas' },
      ]
    : [
        { key: 'others', label: 'Outros' },
        { key: 'my-unit', label: 'Minha filial' },
      ]
  const activeTab = isOperator ? operatorTab : tab

  function selectTab(key: string) {
    setPage(0)

    if (isOperator) {
      setSearchParams(key === 'internal' ? { tab: 'internal' } : {}, {
        replace: true,
      })
      return
    }

    setTab(key as ManagerTab)
  }

  function removeAppliedFilter(key: string) {
    setPage(0)

    if (key === 'status') {
      setDraft((current) => ({ ...current, status: '' }))
      setFilters((current) => ({ ...current, status: '' }))
    }

    if (key === 'type') {
      setDraft((current) => ({ ...current, type: '' }))
      setFilters((current) => ({ ...current, type: '' }))
    }
  }

  function clearAppliedFilters() {
    setPage(0)
    setDraft(INITIAL_RELOCATION_FILTERS)
    setFilters(INITIAL_RELOCATION_FILTERS)
  }

  return (
    <section className="relocations-page list-page">
      <nav className="relocations-breadcrumb">
        <Link to={paths.home}>Início</Link>
        <span>›</span>
        <strong>Realocações</strong>
      </nav>

      <header className="relocations-page__heading">
        <div>
          <h1>Realocações</h1>
          <p>Confira as movimentações das placas da sua filial.</p>
        </div>

        {audience === 'operator' && (
          <Link
            className="relocations-page__request"
            to={paths.relocationCreate}
          >
            Solicitar realocação
          </Link>
        )}
      </header>

      <RelocationsFilters
        hideType={isOperator}
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

      <div className="relocations-tabs" role="tablist">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={activeTab === key}
            className={activeTab === key ? 'active' : ''}
            onClick={() => selectTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <p className="relocations-error" role="alert">
          {error}
        </p>
      )}

      <div className="relocations-table list-table" aria-busy={loading}>
        <div
          className={`relocations-table__header relocations-table__header--${layout}`}
        >
          <strong>ID</strong>
          {!isOperator && <strong>Tipo</strong>}
          {layout !== 'unit' && <strong>Origem</strong>}
          <strong>Destino</strong>
          <strong>Solicitante</strong>
          {layout === 'unit' && <strong>Revisor</strong>}
          <strong>Status</strong>
        </div>

        {!loading &&
          visible.map((item) => (
            <Link
              className={`relocations-table__row relocations-table__row--${layout}`}
              key={`${item.type}-${item.id}`}
              to={
                audience === 'manager'
                  ? `/relocations/manager/${item.type.toLowerCase()}/${item.id}`
                  : `/relocations/${item.type.toLowerCase()}/${item.id}`
              }
            >
              <span>RLC{String(item.id).padStart(6, '0')}</span>
              {!isOperator && <span>{item.typeLabel}</span>}
              {layout !== 'unit' && <span>{item.origin}</span>}
              <span>{item.destination}</span>
              <span>{item.requester}</span>
              {layout === 'unit' && <span>{item.reviewer}</span>}
              <Tag
                label={statusLabels[item.status]}
                tone={relocationStatusTones[item.status]}
              />
            </Link>
          ))}

        {loading && <p className="relocations-table__state">Carregando...</p>}

        {!loading && visible.length === 0 && (
          <p className="relocations-table__state">
            Nenhuma realocação encontrada.
          </p>
        )}
      </div>

      <Paginator
        page={page}
        totalPages={totalPages}
        size={size}
        onPageChange={setPage}
        onSizeChange={(value) => {
          setPage(0)
          setSize(value)
        }}
      />
    </section>
  )
}
