export type MetricsDashboardType = 'corporate' | 'solar'

export interface MetricsDashboardVM {
  title: string
  description: string
  iframeTitle: string
  /** URL de embed do Databricks. Vazia enquanto o link não foi configurado. */
  embedUrl: string
}
