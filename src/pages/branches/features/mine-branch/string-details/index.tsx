import { useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Paginator } from '../../../../../components/paginator'
import { useApiResource } from '../../../../../hooks/useApiResource'
import { paths } from '../../../../../routes/paths'
import {
  formatDate,
  formatKwp,
  padNumber,
} from '../../../../../utils/formatters'
import {
  getPanels,
  getString,
} from '../../../data-access/services/Branches.service'
import {
  toPanelStatusVM,
  toStringStatusVM,
} from '../../../data-access/vm/Branches.vm'
import { BranchesStatusChip } from '../../status-chip'
import { Spinner } from '../../../../../components/spinner'

export function BranchesStringDetails() {
  const { id } = useParams()
  const location = useLocation()
  const inverterId = (location.state as { inverterId?: string } | null)
    ?.inverterId
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)

  const fetchString = useMemo(() => (id ? () => getString(id) : null), [id])
  const fetchPanels = useMemo(
    () => (id ? () => getPanels(id, page, size) : null),
    [id, page, size],
  )
  const stringResource = useApiResource(
    fetchString,
    'Não foi possível carregar a string.',
  )
  const panelsResource = useApiResource(
    fetchPanels,
    'Não foi possível carregar as placas.',
  )

  const item = stringResource.data
  const status = item ? toStringStatusVM(item.status) : null
  const panels = panelsResource.data?.content ?? []
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
        {inverterId ? (
          <Link to={`/branches/inverters/${inverterId}`}>
            {item?.inverterCode ?? '...'}
          </Link>
        ) : (
          <span>{item?.inverterCode ?? '...'}</span>
        )}
        <span>›</span>
        <strong>{item?.code ?? '...'}</strong>
      </nav>

      {!id && (
        <p className="branches-page__error" role="alert">
          String inválida.
        </p>
      )}

      {stringResource.error && (
        <p className="branches-page__error" role="alert">
          {stringResource.error}
        </p>
      )}

      {id && stringResource.loading && (
        <p className="branches-table__state">
          <Spinner />
        </p>
      )}

      {!stringResource.loading && item && status && (
        <>
          <h1 className="branches-details__title">{item.code}</h1>

          <dl className="branches-info branches-info--details">
            <div>
              <dt>Capacidade</dt>
              <dd>{formatKwp(item.nominalPowerKwp)}</dd>
            </div>
            <div>
              <dt>Placas ativas</dt>
              <dd>{item.panelsOperational}</dd>
            </div>
            <div>
              <dt>Placas em manutenção</dt>
              <dd>{item.panelsInMaintenance}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd className={`branches-tone branches-tone--${status.tone}`}>
                {status.label}
              </dd>
            </div>
            <div>
              <dt>Local</dt>
              <dd>{`${item.inverterCode} · MPPT ${padNumber(item.mpptNumber)} · Entrada ${padNumber(item.entryNumber)}`}</dd>
            </div>
          </dl>
        </>
      )}

      <section className="branches-section branches-section--first list-panel">
        <h2 className="branches-section__title">Placas</h2>

        {panelsResource.error && (
          <p className="branches-page__error" role="alert">
            {panelsResource.error}
          </p>
        )}

        <div
          className="branches-table list-table"
          aria-busy={panelsResource.loading}
        >
          <div className="branches-table__header branches-table__header--panels">
            <strong>Nº de série</strong>
            <strong>Fabricante</strong>
            <strong>Modelo</strong>
            <strong>Instalação</strong>
            <strong>Status</strong>
          </div>

          {!panelsResource.loading &&
            panels.map((panel) => (
              <article
                className="branches-table__row branches-table__row--panels"
                key={panel.id}
              >
                <span>{panel.serialNumber}</span>
                <span>{panel.manufacturer}</span>
                <span>{panel.model}</span>
                <span>{formatDate(panel.installationDt)}</span>
                <BranchesStatusChip
                  status={toPanelStatusVM(panel.operatingStats)}
                />
              </article>
            ))}

          {panelsResource.loading && (
            <p className="branches-table__state">
              <Spinner />
            </p>
          )}

          {!panelsResource.loading &&
            !panelsResource.error &&
            panels.length === 0 && (
              <p className="branches-table__state">
                Nenhuma placa cadastrada nesta string.
              </p>
            )}
        </div>

        <Paginator
          page={page}
          totalPages={panelsResource.data?.totalPages ?? 0}
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
