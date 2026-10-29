import { useMemo } from 'react'
import { useApiResource } from '../../../../hooks/useApiResource'
import { formatCnpj, formatKwp } from '../../../../utils/formatters'
import {
  getActiveStringsCount,
  getBranch,
} from '../../data-access/services/Branches.service'
import { BranchesInvertersTable } from './inverters-table/BranchesInvertersTable'
import { Spinner } from '../../../../components/spinner'

interface Props {
  unitId: string | null
  userLoading: boolean
}

export function BranchesMineBranch({ unitId, userLoading }: Props) {
  const fetchBranch = useMemo(
    () => (unitId ? () => getBranch(unitId) : null),
    [unitId],
  )
  const fetchActiveStrings = useMemo(
    () => (unitId ? () => getActiveStringsCount(unitId) : null),
    [unitId],
  )
  const branch = useApiResource(
    fetchBranch,
    'Não foi possível carregar os dados da filial.',
  )
  const activeStrings = useApiResource(
    fetchActiveStrings,
    'Não foi possível contar as strings ativas.',
  )

  if (userLoading) {
    return (
      <p className="branches-table__state">
        <Spinner />
      </p>
    )
  }

  if (!unitId) {
    return (
      <p className="branches-page__error" role="alert">
        Não foi possível identificar a sua filial.
      </p>
    )
  }

  const data = branch.data
  const address = data?.address

  return (
    <>
      {branch.error && (
        <p className="branches-page__error" role="alert">
          {branch.error}
        </p>
      )}

      {branch.loading && (
        <p className="branches-table__state">
          <Spinner />
        </p>
      )}

      {!branch.loading && data && address && (
        <>
          <h2 className="branches-mine__name">{data.name}</h2>

          <dl className="branches-info">
            <div>
              <dt>CNPJ</dt>
              <dd>{formatCnpj(data.cnpj)}</dd>
            </div>
            <div>
              <dt>Endereço</dt>
              <dd>{`${address.streetName}, ${address.number} - ${address.city}, ${address.state}`}</dd>
            </div>
            <div>
              <dt>Capacidade instalada</dt>
              <dd>{formatKwp(data.kwpTotal)}</dd>
            </div>
            <div>
              <dt>Strings ativas</dt>
              <dd>{activeStrings.data ?? '-'}</dd>
            </div>
            <div>
              <dt>OS abertas</dt>
              <dd>{data.openServiceOrdersCount ?? '-'}</dd>
            </div>
            <div>
              <dt>Segmento</dt>
              <dd>{data.segmentName}</dd>
            </div>
          </dl>
        </>
      )}

      <BranchesInvertersTable unitId={unitId} />
    </>
  )
}
