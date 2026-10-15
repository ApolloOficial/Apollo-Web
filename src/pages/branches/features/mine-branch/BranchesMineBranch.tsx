import { useEffect, useState } from 'react'
import { Paginator } from '../../../../components/paginator'
import { formatCnpj, formatKwp } from '../../../../utils/formatters'
import type {
  BranchDTO,
  InverterDTO,
} from '../../data-access/dto/Branches.dto'
import {
  getBranch,
  getInverters,
} from '../../data-access/services/Branches.service'
import { INVERTER_STATUS_LABELS } from '../../data-access/vm/Branches.vm'

interface Props {
  unitId: string | null
  userLoading: boolean
}

export function BranchesMineBranch({ unitId, userLoading }: Props) {
  const [branch, setBranch] = useState<BranchDTO | null>(null)
  const [branchLoading, setBranchLoading] = useState(true)
  const [branchError, setBranchError] = useState('')
  const [inverters, setInverters] = useState<InverterDTO[]>([])
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [invertersLoading, setInvertersLoading] = useState(true)
  const [invertersError, setInvertersError] = useState('')

  useEffect(() => {
    if (!unitId) return

    let active = true

    void (async () => {
      await Promise.resolve()
      if (!active) return

      setBranchLoading(true)
      setBranchError('')

      try {
        const result = await getBranch(unitId)

        if (active) setBranch(result)
      } catch (cause) {
        if (active) {
          setBranchError(
            cause instanceof Error
              ? cause.message
              : 'Não foi possível carregar os dados da filial.',
          )
        }
      } finally {
        if (active) setBranchLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [unitId])

  useEffect(() => {
    if (!unitId) return

    let active = true

    void (async () => {
      await Promise.resolve()
      if (!active) return

      setInvertersLoading(true)
      setInvertersError('')

      try {
        const result = await getInverters(unitId, page, size)

        if (active) {
          setInverters(result.content)
          setTotalPages(result.totalPages)
        }
      } catch (cause) {
        if (active) {
          setInvertersError(
            cause instanceof Error
              ? cause.message
              : 'Não foi possível carregar os inversores.',
          )
        }
      } finally {
        if (active) setInvertersLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [unitId, page, size])

  if (userLoading) {
    return <p className="branches-table__state">Carregando...</p>
  }

  if (!unitId) {
    return (
      <p className="branches-page__error" role="alert">
        Não foi possível identificar a sua filial.
      </p>
    )
  }

  const address = branch?.address

  return (
    <>
      {branchError && (
        <p className="branches-page__error" role="alert">
          {branchError}
        </p>
      )}

      {branchLoading && <p className="branches-table__state">Carregando...</p>}

      {!branchLoading && branch && address && (
        <>
          <h2 className="branches-mine__name">{branch.name}</h2>

          <dl className="branches-info">
            <div>
              <dt>CNPJ</dt>
              <dd>{formatCnpj(branch.cnpj)}</dd>
            </div>
            <div>
              <dt>Endereço</dt>
              <dd>
                {`${address.streetName}, ${address.number}`}
                <br />
                {`${address.neighborhood}, ${address.city} - ${address.state}`}
              </dd>
            </div>
            <div>
              <dt>Capacidade instalada</dt>
              <dd>{formatKwp(branch.kwpTotal)}</dd>
            </div>
            <div>
              <dt>Inversores ativos</dt>
              <dd>{branch.activeInvertersCount ?? '-'}</dd>
            </div>
            <div>
              <dt>OS abertas</dt>
              <dd>{branch.openServiceOrdersCount ?? '-'}</dd>
            </div>
            <div>
              <dt>Segmento</dt>
              <dd>{branch.segmentName}</dd>
            </div>
          </dl>
        </>
      )}

      <h3 className="branches-mine__subtitle">Inversores</h3>

      {invertersError && (
        <p className="branches-page__error" role="alert">
          {invertersError}
        </p>
      )}

      <div className="branches-table" aria-busy={invertersLoading}>
        <div className="branches-table__header branches-table__header--mine">
          <strong>Código</strong>
          <strong>Modelo</strong>
          <strong>Nº de série</strong>
          <strong>Strings</strong>
          <strong>Status</strong>
        </div>

        {!invertersLoading &&
          inverters.map((inverter) => (
            <article
              className="branches-table__row branches-table__row--mine"
              key={inverter.id}
            >
              <span>{inverter.code}</span>
              <span>{`${inverter.brand} ${inverter.model}`}</span>
              <span>{inverter.serialNumber}</span>
              <span>{inverter.stringsCount}</span>
              <span
                className={`branches-status branches-status--${inverter.status.toLowerCase()}`}
              >
                {INVERTER_STATUS_LABELS[inverter.status]}
              </span>
            </article>
          ))}

        {invertersLoading && (
          <p className="branches-table__state">Carregando...</p>
        )}

        {!invertersLoading && !invertersError && inverters.length === 0 && (
          <p className="branches-table__state">
            Nenhum inversor cadastrado nesta filial.
          </p>
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
