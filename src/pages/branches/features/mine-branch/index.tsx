import {
  useActiveStringsCount,
  useBranch,
} from '../../../../hooks/useBranchData'
import { formatCnpj, formatKwp } from '../../../../utils/formatters'
import { BranchesInvertersTable } from './inverters-table'
import { Spinner } from '../../../../components/spinner'

interface Props {
  unitId: string | null
  userLoading: boolean
}

export function BranchesMineBranch({ unitId, userLoading }: Props) {
  const branch = useBranch(unitId)
  const activeStrings = useActiveStringsCount(unitId)

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
