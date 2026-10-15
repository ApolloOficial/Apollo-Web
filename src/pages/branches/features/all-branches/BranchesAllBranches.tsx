import { useCallback, useEffect, useState } from 'react'
import { Paginator } from '../../../../components/paginator'
import { formatCnpj } from '../../../../utils/formatters'
import type { BranchDTO } from '../../data-access/dto/Branches.dto'
import { getBranches } from '../../data-access/services/Branches.service'
import type { BranchFiltersVM } from '../../data-access/vm/Branches.vm'

interface Props {
  filters: BranchFiltersVM
}

export function BranchesAllBranches({ filters }: Props) {
  const [branches, setBranches] = useState<BranchDTO[]>([])
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastFilters, setLastFilters] = useState(filters)

  if (lastFilters !== filters) {
    setLastFilters(filters)
    setPage(0)
  }

  const loadBranches = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const result = await getBranches(filters, page, size)

      setBranches(result.content)
      setTotalPages(result.totalPages)
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Não foi possível carregar as filiais.',
      )
    } finally {
      setLoading(false)
    }
  }, [filters, page, size])

  useEffect(() => {
    void (async () => {
      await Promise.resolve()
      await loadBranches()
    })()
  }, [loadBranches])

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
        totalPages={totalPages}
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
