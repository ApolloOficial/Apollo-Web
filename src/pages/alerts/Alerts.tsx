import { useSearchParams } from 'react-router-dom'
import { alertFiltersFromParams } from './data-access/vm/Alerts.vm'
import { AlertsFeature, type AlertsAudience } from './features/Alerts'
import './Alerts.css'

interface Props {
  audience?: AlertsAudience
}

export default function Alerts({ audience = 'operator' }: Props) {
  const [params] = useSearchParams()

  return (
    <AlertsFeature
      key={params.toString()}
      audience={audience}
      initialFilters={alertFiltersFromParams(params)}
    />
  )
}
