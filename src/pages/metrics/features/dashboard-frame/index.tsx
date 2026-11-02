import { useState } from 'react'
import { Spinner } from '../../../../components/spinner'

interface Props {
  embedUrl: string
  title: string
  userStatus?: 'loading' | 'missing'
}

export function MetricsDashboardFrame({ embedUrl, title, userStatus }: Props) {
  const [loadedUrl, setLoadedUrl] = useState('')

  if (userStatus === 'loading') {
    return (
      <div
        className="metrics-frame metrics-frame--empty"
        role="status"
        aria-busy="true"
      >
        <Spinner />
      </div>
    )
  }

  if (userStatus === 'missing') {
    return (
      <div className="metrics-frame metrics-frame--empty" role="status">
        <strong>Não foi possível identificar sua empresa e filial</strong>
        <p>Entre novamente para carregar este dashboard.</p>
      </div>
    )
  }

  if (!embedUrl) {
    return (
      <div className="metrics-frame metrics-frame--empty" role="status">
        <strong>Dashboard ainda não configurado</strong>
        <p>O link do Databricks para esta tela ainda não foi informado.</p>
      </div>
    )
  }

  const loading = loadedUrl !== embedUrl

  return (
    <div className="metrics-frame" aria-busy={loading}>
      {loading && (
        <p className="metrics-frame__loading">
          <Spinner />
        </p>
      )}

      <iframe
        className="metrics-frame__iframe"
        src={embedUrl}
        title={title}
        loading="lazy"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={() => setLoadedUrl(embedUrl)}
      />
    </div>
  )
}
