import { sanitizeEmbedUrl } from '../../../../utils/validators/url'
import type { MetricsDashboardType, MetricsDashboardVM } from '../vm/Metrics.vm'

/**
 * Os links de embed dos dashboards do Databricks vêm das variáveis de ambiente
 * VITE_DATABRICKS_CORPORATE_URL e VITE_DATABRICKS_SOLAR_URL (ver .env.example).
 */
export const METRICS_DASHBOARDS: Record<
  MetricsDashboardType,
  MetricsDashboardVM
> = {
  corporate: {
    title: 'Métricas corporativas',
    description: 'Acompanhe o resultado do seu time.',
    iframeTitle: 'Dashboard de métricas corporativas',
    embedUrl: sanitizeEmbedUrl(import.meta.env.VITE_DATABRICKS_CORPORATE_URL),
  },
  solar: {
    title: 'Métricas solares',
    description: 'Acompanhe os resultados das placas solares na empresa.',
    iframeTitle: 'Dashboard de métricas solares',
    embedUrl: sanitizeEmbedUrl(import.meta.env.VITE_DATABRICKS_SOLAR_URL),
  },
}
