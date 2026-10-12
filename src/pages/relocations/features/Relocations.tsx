import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Paginator } from '../../../components/paginator'
import { paths } from '../../../routes/paths'
import type { ExternalRelocationDTO, InternalRelocationDTO } from '../data-access/dto/Relocations.dto'
import { getExternalRelocations, getIncomingInternalRelocations, getMe, getMyInternalRelocations } from '../data-access/services/Relocations.service'
import { INITIAL_RELOCATION_FILTERS, type RelocationFiltersVM, type RelocationListItemVM } from '../data-access/vm/Relocations.vm'
import { RelocationsFilters } from './filters/RelocationsFilters'

export type RelocationsAudience = 'operator' | 'manager'
type ManagerTab = 'others' | 'my-unit'
const toInternal = (item: InternalRelocationDTO): RelocationListItemVM => ({ id: item.id, type: 'INTERNAL', typeLabel: 'Interna', origin: item.originUnitName, destination: item.suggestedUnitName, requester: item.requestedByName, reviewer: item.reviewedByName ?? '—', status: item.status })
const toExternal = (item: ExternalRelocationDTO): RelocationListItemVM => ({ id: item.id, type: 'EXTERNAL', typeLabel: 'Externa', origin: item.originUnitName, destination: item.destinationCompanyName, requester: item.requestedByName, reviewer: item.reviewedByName ?? '—', status: item.status })
const statusLabels = { PENDENTE: 'Pendente', APROVADA: 'Aprovada', REJEITADA: 'Rejeitada', CONCLUIDA: 'Concluída' }

export function RelocationsFeature({ audience }: { audience: RelocationsAudience }) {
  const [items, setItems] = useState<RelocationListItemVM[]>([])
  const [draft, setDraft] = useState<RelocationFiltersVM>(INITIAL_RELOCATION_FILTERS)
  const [filters, setFilters] = useState<RelocationFiltersVM>(INITIAL_RELOCATION_FILTERS)
  const [tab, setTab] = useState<ManagerTab>('others')
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      if (audience === 'operator') {
        const [me, internal, external] = await Promise.all([getMe(),
          getMyInternalRelocations({ status: filters.status, page: 0, size: 100 }),
          getExternalRelocations({ status: filters.status, page: 0, size: 100 })])
        setItems([...internal.content.map(toInternal),
          ...external.content.filter((item) => item.requestedById === me.userId).map(toExternal)])
      } else if (tab === 'my-unit') {
        const result = await getIncomingInternalRelocations({ status: filters.status, page: 0, size: 100 })
        setItems(result.content.map(toInternal))
      } else {
        const result = await getExternalRelocations({ status: filters.status, page: 0, size: 100 })
        setItems(result.content.map(toExternal))
      }
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível carregar as realocações.') }
    finally { setLoading(false) }
  }, [audience, filters, tab])

  // A consulta remota precisa acompanhar os filtros e a aba selecionada.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load() }, [load])
  const filtered = useMemo(() => filters.type ? items.filter((item) => item.type === filters.type) : items, [filters.type, items])
  const totalPages = Math.ceil(filtered.length / size)
  const visible = useMemo(() => filtered.slice(page * size, page * size + size), [filtered, page, size])

  return <section className="relocations-page">
    <nav className="relocations-breadcrumb"><Link to={paths.home}>Início</Link><span>›</span><strong>Realocações</strong></nav>
    <header className="relocations-page__heading"><div><h1>Realocações</h1><p>Confira as movimentações das placas da sua filial.</p></div>
      {audience === 'operator' && <Link className="relocations-page__request" to={paths.relocationCreate}>Solicitar realocação</Link>}</header>
    <RelocationsFilters value={draft} onChange={setDraft} onApply={() => { setPage(0); setFilters(draft) }} />
    {audience === 'manager' && <div className="relocations-tabs" role="tablist">
      <button type="button" role="tab" aria-selected={tab === 'others'} className={tab === 'others' ? 'active' : ''} onClick={() => { setPage(0); setTab('others') }}>Outros</button>
      <button type="button" role="tab" aria-selected={tab === 'my-unit'} className={tab === 'my-unit' ? 'active' : ''} onClick={() => { setPage(0); setTab('my-unit') }}>Minha filial</button>
    </div>}
    {error && <p className="relocations-error" role="alert">{error}</p>}
    <div className="relocations-table" aria-busy={loading}>
      <div className="relocations-table__header"><strong>ID</strong><strong>Tipo</strong><strong>Origem</strong><strong>Destino</strong><strong>Solicitante</strong><strong>Status</strong></div>
      {!loading && visible.map((item) => <Link className="relocations-table__row" key={`${item.type}-${item.id}`}
        to={audience === 'manager' ? `/relocations/manager/${item.type.toLowerCase()}/${item.id}` : `/relocations/${item.type.toLowerCase()}/${item.id}`}>
        <span>RLC{String(item.id).padStart(6, '0')}</span><span>{item.typeLabel}</span><span>{item.origin}</span>
        <span>{item.destination}</span><span>{item.requester}</span>
        <span className={`relocation-status ${item.status.toLowerCase()}`}>{statusLabels[item.status]}</span>
      </Link>)}
      {loading && <p className="relocations-table__state">Carregando...</p>}
      {!loading && !visible.length && <p className="relocations-table__state">Nenhuma realocação encontrada.</p>}
    </div>
    <Paginator page={page} totalPages={totalPages} size={size} onPageChange={setPage}
      onSizeChange={(value) => { setPage(0); setSize(value) }} />
  </section>
}
