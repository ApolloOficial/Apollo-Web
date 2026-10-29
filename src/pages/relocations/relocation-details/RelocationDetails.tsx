import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { paths } from '../../../routes/paths'
import type {
  ExternalRelocationDTO,
  InternalRelocationDTO,
} from '../data-access/dto/Relocations.dto'
import {
  getExternalRelocation,
  getInternalRelocation,
  reviewExternalRelocation,
  reviewInternalRelocation,
} from '../data-access/services/Relocations.service'
import { relocationStatusLabels } from '../data-access/vm/Relocations.vm'
import '../Relocations.css'

type Data =
  | { type: 'INTERNAL'; item: InternalRelocationDTO }
  | { type: 'EXTERNAL'; item: ExternalRelocationDTO }

export default function RelocationDetails({
  managerMode = false,
}: {
  managerMode?: boolean
}) {
  const { id, type } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState<Data | null>(null)
  const [loading, setLoading] = useState(true)
  const [reviewing, setReviewing] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!id || !type) {
      setError('Realocação inválida.')
      setLoading(false)
      return
    }
    try {
      if (type === 'internal')
        setData({
          type: 'INTERNAL',
          item: await getInternalRelocation(Number(id)),
        })
      else if (type === 'external')
        setData({
          type: 'EXTERNAL',
          item: await getExternalRelocation(Number(id)),
        })
      else setError('Tipo de realocação inválido.')
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Erro ao carregar detalhes.',
      )
    } finally {
      setLoading(false)
    }
  }, [id, type])

  // Os detalhes são recarregados sempre que o identificador da rota muda.
  useEffect(() => {
    void (async () => {
      await Promise.resolve()
      await load()
    })()
  }, [load])

  async function review(status: 'APROVADA' | 'REJEITADA') {
    if (!data) return
    setReviewing(true)
    setError('')
    try {
      if (data.type === 'INTERNAL')
        await reviewInternalRelocation(data.item.id, { status })
      else await reviewExternalRelocation(data.item.id, { status })
      navigate(paths.relocationManager)
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Erro ao registrar decisão.',
      )
    } finally {
      setReviewing(false)
    }
  }

  if (loading) return <p>Carregando...</p>
  if (!data)
    return (
      <p className="relocations-error" role="alert">
        {error}
      </p>
    )
  const { item } = data
  const destination =
    'suggestedUnitName' in item
      ? item.suggestedUnitName
      : item.destinationCompanyName
  const quantity = 'quantity' in item ? item.quantity : 1

  return (
    <section className="relocation-details">
      <nav className="relocations-breadcrumb">
        <Link to={paths.home}>Início</Link>
        <span>›</span>
        <Link to={paths.relocations}>Realocações</Link>
        <span>›</span>
        <strong>Detalhes</strong>
      </nav>
      <h1>RLC{String(item.id).padStart(6, '0')}</h1>
      <dl className="relocation-details__grid">
        <div>
          <dt>Tipo</dt>
          <dd>{data.type === 'INTERNAL' ? 'Interna' : 'Externa'}</dd>
        </div>
        <div>
          <dt>Solicitante</dt>
          <dd>{item.requestedByName}</dd>
        </div>
        {(data.type === 'INTERNAL' || item.reviewedByName) && (
          <div>
            <dt>Revisor</dt>
            <dd>{item.reviewedByName ?? '—'}</dd>
          </div>
        )}
        <div>
          <dt>Qtd. de placas</dt>
          <dd>{quantity}</dd>
        </div>
        <div>
          <dt>Destino</dt>
          <dd>{destination}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd className={`status-text ${item.status.toLowerCase()}`}>
            {relocationStatusLabels[item.status]}
          </dd>
        </div>
      </dl>
      <section className="relocation-details__description">
        <h2>Descrição</h2>
        <p>{item.justification}</p>
      </section>
      {error && (
        <p className="relocations-error" role="alert">
          {error}
        </p>
      )}
      {managerMode && item.status === 'PENDENTE' && (
        <div className="relocation-details__actions">
          <button
            className="approve"
            disabled={reviewing}
            onClick={() => void review('APROVADA')}
          >
            Aprovar
          </button>
          <button
            className="reject"
            disabled={reviewing}
            onClick={() => void review('REJEITADA')}
          >
            Rejeitar
          </button>
        </div>
      )}
    </section>
  )
}
