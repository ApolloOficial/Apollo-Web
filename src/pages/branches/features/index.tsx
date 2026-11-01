import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  AppliedFilters,
  type AppliedFilter,
} from '../../../components/applied-filters'
import { useLayoutContext } from '../../../hooks/useLayoutContext'
import { useTabIndicator } from '../../../hooks/useTabIndicator'
import { paths } from '../../../routes/paths'
import { getBranches } from '../data-access/services/Branches.service'
import {
  INITIAL_BRANCH_FILTERS,
  type BranchesTabVM,
  type BranchFiltersVM,
} from '../data-access/vm/Branches.vm'
import { BranchesAllBranches } from './all-branches'
import { BranchesFilters } from './filters'
import { BranchesMineBranch } from './mine-branch'

function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, 'pt-BR'))
}

export function BranchesFeature() {
  const { user, loading: userLoading } = useLayoutContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const tab: BranchesTabVM = searchParams.get('tab') === 'mine' ? 'mine' : 'all'
  const { ref: tabsRef, indicatorProps } = useTabIndicator(tab)
  const [draft, setDraft] = useState<BranchFiltersVM>(INITIAL_BRANCH_FILTERS)
  const [applied, setApplied] = useState<BranchFiltersVM>(
    INITIAL_BRANCH_FILTERS,
  )
  const urlName = searchParams.get('name') ?? ''
  const filters = useMemo<BranchFiltersVM>(
    () => (urlName ? { ...applied, name: urlName } : applied),
    [applied, urlName],
  )
  const [nameOptions, setNameOptions] = useState<string[]>([])
  const [cityOptions, setCityOptions] = useState<string[]>([])

  useEffect(() => {
    void getBranches(INITIAL_BRANCH_FILTERS, 0, 100)
      .then(({ content }) => {
        setNameOptions(uniqueSorted(content.map((branch) => branch.name)))
        setCityOptions(
          uniqueSorted(content.map((branch) => branch.address.city)),
        )
      })
      .catch(() => {
        setNameOptions([])
        setCityOptions([])
      })
  }, [])

  const appliedFilters = useMemo<AppliedFilter[]>(() => {
    const result: AppliedFilter[] = []

    if (filters.name) {
      result.push({ key: 'name', label: 'Filial', value: filters.name })
    }

    if (filters.city) {
      result.push({ key: 'city', label: 'Cidade', value: filters.city })
    }

    return result
  }, [filters])

  function setTab(next: BranchesTabVM) {
    setSearchParams(next === 'mine' ? { tab: 'mine' } : {}, { replace: true })
  }

  function clearUrlName() {
    if (!searchParams.has('name')) return

    const next = new URLSearchParams(searchParams)

    next.delete('name')
    setSearchParams(next, { replace: true })
  }

  function removeAppliedFilter(key: string) {
    if (key === 'name' || key === 'city') {
      if (key === 'name') clearUrlName()
      setDraft((current) => ({ ...current, [key]: '' }))
      setApplied((current) => ({ ...current, [key]: '' }))
    }
  }

  function clearAppliedFilters() {
    clearUrlName()
    setDraft(INITIAL_BRANCH_FILTERS)
    setApplied(INITIAL_BRANCH_FILTERS)
  }

  return (
    <section className="branches-page list-page">
      <nav
        className="branches-page__breadcrumb"
        aria-label="Navegação estrutural"
      >
        <Link to={paths.home}>Início</Link>
        <span>›</span>
        <strong>Filiais</strong>
      </nav>

      <header className="branches-page__heading">
        <h1>Filiais</h1>
        <p>
          Unidades da empresa com sistemas fotovoltaicos. Cadastre novas filiais
          ou acompanhe as existentes.
        </p>
      </header>

      {tab === 'all' && (
        <>
          <BranchesFilters
            value={draft}
            nameOptions={nameOptions}
            cityOptions={cityOptions}
            onChange={setDraft}
            onApply={() => {
              clearUrlName()
              setApplied({
                name: draft.name.trim(),
                city: draft.city.trim(),
              })
            }}
          />

          <AppliedFilters
            filters={appliedFilters}
            onRemove={removeAppliedFilter}
            onClear={clearAppliedFilters}
          />
        </>
      )}

      <div
        ref={tabsRef}
        className="branches-tabs"
        role="tablist"
        aria-label="Visualização de filiais"
      >
        <span {...indicatorProps} />
        <button
          type="button"
          role="tab"
          id="branches-tab-all"
          aria-selected={tab === 'all'}
          aria-controls="branches-panel"
          onClick={() => setTab('all')}
        >
          Todas as filiais
        </button>

        <button
          type="button"
          role="tab"
          id="branches-tab-mine"
          aria-selected={tab === 'mine'}
          aria-controls="branches-panel"
          onClick={() => setTab('mine')}
        >
          Minha filial
        </button>
      </div>

      <div
        id="branches-panel"
        className={
          tab === 'all' ? 'list-panel' : 'list-panel list-panel--scroll'
        }
        role="tabpanel"
        aria-labelledby={`branches-tab-${tab}`}
      >
        {tab === 'all' ? (
          <BranchesAllBranches filters={filters} />
        ) : (
          <BranchesMineBranch
            unitId={user?.companyUnitId ?? null}
            userLoading={userLoading}
          />
        )}
      </div>
    </section>
  )
}
