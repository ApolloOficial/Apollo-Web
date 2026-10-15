import { useState } from 'react'

interface Props {
  embedUrl: string
  title: string
}

export function MetricsDashboardFrame({ embedUrl, title }: Props) {
  const [loadedUrl, setLoadedUrl] = useState('')

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
      {loading && <p className="metrics-frame__loading">Carregando...</p>}

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
