export interface MetricsFilterParams {
  company: string
  unit: string
}

export interface MetricsDashboardVM {
  title: string
  description: string
  iframeTitle: string
  embedUrl: string
  filterParams?: MetricsFilterParams
}
