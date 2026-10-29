import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Paginator } from '../../../../../components/paginator'
import { useApiResource } from '../../../../../hooks/useApiResource'
import { useCurrentUserContext } from '../../../../../hooks/useCurrentUserContext'
import { paths } from '../../../../../routes/paths'
import { formatLastReading } from '../../../../../utils/formatters'
import { isOperator } from '../../../../../utils/user'
import {
  getInverters,
  getLastReadings,
} from '../../../data-access/services/Branches.service'
import { toInverterStatusVM } from '../../../data-access/vm/Branches.vm'
import { BranchesStatusChip } from '../../status-chip/BranchesStatusChip'
import { TableSkeleton } from '../../../../../components/table-skeleton'

interface Props {
  unitId: string
}

export function BranchesInvertersTable({ unitId }: Props) {
  const { user } = useCurrentUserContext()
  const canRegisterInverter = isOperator(user?.role)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)

  const fetchInverters = useMemo(
    () => () => getInverters(unitId, page, size),
    [unitId, page, size],
  )
  const { data, loading, error } = useApiResource(
    fetchInverters,
    'Não foi possível carregar os inversores.',
  )
  const inverters = data?.content ?? []

  const fetchReadings = useMemo(
    () => (data ? () => getLastReadings(data.content) : null),
    [data],
  )
  const readings = useApiResource(
    fetchReadings,
    'Não foi possível carregar as leituras.',
  )

  function readingOf(id: string) {
    if (!readings.data || !(id in readings.data)) return '...'

    return formatLastReading(readings.data[id])
  }

  return (
    <section className="branches-section">
      <div className="branches-section__header">
        <h3 className="branches-section__title">Inversores</h3>

        {canRegisterInverter && (
          <Link
            className="branches-section__action"
            to={paths.branchInverterCreate}
          >
            Cadastrar inversor
          </Link>
        )}
      </div>

      {error && (
        <p className="branches-page__error" role="alert">
          {error}
        </p>
      )}

      <div className="branches-table list-table" aria-busy={loading}>
        <div className="branches-table__header branches-table__header--inverters">
          <strong>Inversor</strong>
          <strong>Modelo</strong>
          <strong>Strings</strong>
          <strong>Última leitura</strong>
          <strong>Status</strong>
        </div>

        {!loading &&
          inverters.map((inverter) => (
            <Link
              className="branches-table__row branches-table__row--inverters"
              key={inverter.id}
              to={`/branches/inverters/${inverter.id}`}
            >
              <span>{inverter.code}</span>
              <span>{`${inverter.brand} ${inverter.model}`}</span>
              <span>{inverter.stringsCount}</span>
              <span>{readingOf(inverter.id)}</span>
              <BranchesStatusChip
                status={toInverterStatusVM(inverter.status)}
              />
            </Link>
          ))}

        {loading && <TableSkeleton />}

        {!loading && !error && inverters.length === 0 && (
          <p className="branches-table__state">
            Nenhum inversor cadastrado nesta filial.
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
