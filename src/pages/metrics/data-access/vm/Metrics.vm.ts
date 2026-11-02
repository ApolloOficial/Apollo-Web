export interface MetricsFilterParams {
  company: string
  unit: string
}

export interface MetricsDashboardVM {
  title: string
  description: string
  iframeTitle: string
  /** URL de embed do Databricks. Vazia enquanto o link não foi configurado. */
  embedUrl: string
  filterParams?: MetricsFilterParams
}
