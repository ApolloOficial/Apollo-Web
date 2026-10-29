import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Paginator } from '../../../../../components/paginator'
import { useApiResource } from '../../../../../hooks/useApiResource'
import { paths } from '../../../../../routes/paths'
import {
  formatKw,
  formatLastReading,
  formatPercent,
  padNumber,
} from '../../../../../utils/formatters'
import {
  getInverter,
  getInverterModels,
  getLastReading,
  getStrings,
} from '../../../data-access/services/Branches.service'
import { toInverterStatusVM } from '../../../data-access/vm/Branches.vm'

export function BranchesInverterDetails() {
  const { id } = useParams()
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)

  const fetchInverter = useMemo(() => (id ? () => getInverter(id) : null), [id])
  const inverterResource = useApiResource(
    fetchInverter,
    'Não foi possível carregar o inversor.',
  )
  const modelsResource = useApiResource(
    getInverterModels,
    'Não foi possível carregar os modelos de inversor.',
  )

  const inverter = inverterResource.data
  const unitId = inverter?.companyUnitId
  const code = inverter?.code

  const fetchReading = useMemo(
    () => (unitId && code ? () => getLastReading(unitId, code) : null),
    [unitId, code],
  )
  const fetchEntries = useMemo(
    () =>
      unitId && code
        ? () => getStrings({ unitId, inverterCode: code, page, size })
        : null,
    [unitId, code, page, size],
  )
  const readingResource = useApiResource(
    fetchReading,
    'Não foi possível carregar a última leitura.',
  )
  const entriesResource = useApiResource(
    fetchEntries,
    'Não foi possível carregar as strings.',
  )

  const status = inverter ? toInverterStatusVM(inverter.status) : null
  const ratedPower = modelsResource.data?.content.find(
    (model) => model.id === inverter?.inverterModelId,
  )?.ratedPowerKw
  const entries = entriesResource.data?.content ?? []
  const listPath = `${paths.branches}?tab=mine`

  return (
    <section className="branches-page list-page">
      <nav
        className="branches-page__breadcrumb"
        aria-label="Navegação estrutural"
      >
        <Link to={paths.home}>Início</Link>
        <span>›</span>
        <Link to={listPath}>Filiais</Link>
        <span>›</span>
        <Link to={listPath}>Inversores</Link>
        <span>›</span>
        <strong>{code ?? '...'}</strong>
      </nav>

      {!id && (
        <p className="branches-page__error" role="alert">
          Inversor inválido.
        </p>
      )}

      {inverterResource.error && (
        <p className="branches-page__error" role="alert">
          {inverterResource.error}
        </p>
      )}

      {id && inverterResource.loading && (
        <p className="branches-table__state">Carregando...</p>
      )}

      {!inverterResource.loading && inverter && status && (
        <>
          <h1 className="branches-details__title">{inverter.code}</h1>

          <dl className="branches-info branches-info--details">
            <div>
              <dt>Equipamento</dt>
              <dd>
                {ratedPower === undefined
                  ? `${inverter.brand} ${inverter.model}`
                  : `${inverter.brand} ${inverter.model} · ${formatKw(ratedPower)}`}
              </dd>
            </div>
            <div>
              <dt>Número de série</dt>
              <dd>{inverter.serialNumber}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd className={`branches-tone branches-tone--${status.tone}`}>
                {status.label}
              </dd>
            </div>
            <div>
              <dt>Última leitura</dt>
              <dd>
                {readingResource.loading
                  ? '...'
                  : formatLastReading(readingResource.data)}
              </dd>
            </div>
          </dl>
        </>
      )}

      <section className="branches-section branches-section--first list-panel">
        <h2 className="branches-section__title">Strings</h2>

        {entriesResource.error && (
          <p className="branches-page__error" role="alert">
            {entriesResource.error}
          </p>
        )}

        <div
          className="branches-table list-table"
          aria-busy={entriesResource.loading}
        >
          <div className="branches-table__header branches-table__header--entries">
            <strong>Entrada</strong>
            <strong>String</strong>
            <strong>Qtd. de placas instaladas</strong>
            <strong>Fabricante / Modelo</strong>
            <strong>Saúde</strong>
          </div>

          {!entriesResource.loading &&
            entries.map((entry) => (
              <Link
                className="branches-table__row branches-table__row--entries"
                key={entry.id}
                to={`/branches/strings/${entry.id}`}
                state={{ inverterId: id }}
              >
                <span>{`MPPT ${padNumber(entry.mpptNumber)} · Entrada ${padNumber(entry.entryNumber)}`}</span>
                <span>{entry.code}</span>
                <span>{`${entry.installedPanels}/${entry.purchasedQty}`}</span>
                <span>{`${entry.manufacturer} ${entry.model}`}</span>
                <span>{formatPercent(entry.healthScore)}</span>
              </Link>
            ))}

          {entriesResource.loading && (
            <p className="branches-table__state">Carregando...</p>
          )}

          {!entriesResource.loading &&
            !entriesResource.error &&
            entries.length === 0 && (
              <p className="branches-table__state">
                Nenhuma string neste inversor.
              </p>
            )}
        </div>

        <Paginator
          page={page}
          totalPages={entriesResource.data?.totalPages ?? 0}
          size={size}
          onPageChange={setPage}
          onSizeChange={(newSize) => {
            setPage(0)
            setSize(newSize)
          }}
        />
      </section>
    </section>
  )
}
