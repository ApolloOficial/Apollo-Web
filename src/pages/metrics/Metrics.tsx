import { MetricsFeature } from './features/Metrics'
import type { MetricsDashboardType } from './data-access/vm/Metrics.vm'

interface Props {
  type: MetricsDashboardType
}

export default function Metrics({ type }: Props) {
  return <MetricsFeature type={type} />
}
