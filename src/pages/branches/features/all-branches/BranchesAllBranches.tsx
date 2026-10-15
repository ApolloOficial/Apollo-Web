import { useMemo, useState } from 'react'
import { Paginator } from '../../../../components/paginator'
import { useApiResource } from '../../../../hooks/useApiResource'
import { formatCnpj } from '../../../../utils/formatters'
import { getBranches } from '../../data-access/services/Branches.service'
import type { BranchFiltersVM } from '../../data-access/vm/Branches.vm'

interface Props {
  filters: BranchFiltersVM
}

export function BranchesAllBranches({ filters }: Props) {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [lastFilters, setLastFilters] = useState(filters)

  if (lastFilters !== filters) {
    setLastFilters(filters)
    setPage(0)
  }

  const fetchBranches = useMemo(
    () => () => getBranches(filters, page, size),
    [filters, page, size],
  )
  const { data, loading, error } = useApiResource(
    fetchBranches,
    'Não foi possível carregar as filiais.',
  )
  const branches = data?.content ?? []

  return (
    <>
      {error && (
        <p className="branches-page__error" role="alert">
          {error}
        </p>
      )}

      <div className="branches-table" aria-busy={loading}>
        <div className="branches-table__header branches-table__header--all">
          <strong>Filial</strong>
          <strong>CNPJ</strong>
          <strong>Cidade</strong>
          <strong>Responsável</strong>
        </div>

        {!loading &&
          branches.map((branch) => (
            <article
              className="branches-table__row branches-table__row--all"
              key={branch.id}
            >
              <span>{branch.name}</span>
              <span>{formatCnpj(branch.cnpj)}</span>
              <span>{`${branch.address.city}, ${branch.address.state}`}</span>
              <span>{branch.responsibleEmployeeName ?? '-'}</span>
            </article>
          ))}

        {loading && <p className="branches-table__state">Carregando...</p>}

        {!loading && !error && branches.length === 0 && (
          <p className="branches-table__state">Nenhuma filial encontrada.</p>
        )}
      </div>

      <Paginator
        page={page}
        totalPages={data?.totalPages ?? 0}
        size={size}
        onPageChange={setPage}
        onSizeChange={(newSize) => {
          setPage(0)
          setSize(newSize)
        }}
      />
    </>
  )
}
