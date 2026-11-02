import { sanitizeEmbedUrl } from '../../../../utils/validators/url'
import type { MetricsDashboardVM } from '../vm/Metrics.vm'

export const METRICS_DASHBOARD: MetricsDashboardVM = {
  title: 'Métricas solares',
  description: 'Acompanhe os resultados das placas solares na empresa.',
  iframeTitle: 'Dashboard de métricas solares',
  embedUrl: sanitizeEmbedUrl(import.meta.env.VITE_DATABRICKS_SOLAR_URL),
  filterParams: {
    company: 'f_b445d0e8~filtro_empresa.s',
    unit: 'f_b445d0e8~filtro_filial.s',
  },
}
