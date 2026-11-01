import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Paginator } from '../../../../../components/paginator'
import { useApiResource } from '../../../../../hooks/useApiResource'
import { formatKwp } from '../../../../../utils/formatters'
import { getStrings } from '../../../data-access/services/Branches.service'
import { toStringStatusVM } from '../../../data-access/vm/Branches.vm'
import { BranchesStatusChip } from '../../status-chip'
import { TableSkeleton } from '../../../../../components/table-skeleton'

interface Props {
  unitId: string
}

export function BranchesStringsTable({ unitId }: Props) {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)

  const fetchStrings = useMemo(
    () => () => getStrings({ unitId, page, size }),
    [unitId, page, size],
  )
  const { data, loading, error } = useApiResource(
    fetchStrings,
    'Não foi possível carregar as strings.',
  )
  const strings = data?.content ?? []

  return (
    <section className="branches-section">
      <h3 className="branches-section__title">Strings de painéis</h3>

      {error && (
        <p className="branches-page__error" role="alert">
          {error}
        </p>
      )}

      <div className="branches-table list-table" aria-busy={loading}>
        <div className="branches-table__header branches-table__header--strings">
          <strong>String</strong>
          <strong>Quantidade de painéis</strong>
          <strong>Capacidade</strong>
          <strong>Status</strong>
        </div>

        {!loading &&
          strings.map((item) => (
            <Link
              className="branches-table__row branches-table__row--strings"
              key={item.id}
              to={`/branches/strings/${item.id}`}
            >
              <span>{item.code}</span>
              <span>{item.installedPanels}</span>
              <span>{formatKwp(item.nominalPowerKwp)}</span>
              <BranchesStatusChip status={toStringStatusVM(item.status)} />
            </Link>
          ))}

        {loading && <TableSkeleton />}

        {!loading && !error && strings.length === 0 && (
          <p className="branches-table__state">
            Nenhuma string cadastrada nesta filial.
          </p>
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
    </section>
  )
}
