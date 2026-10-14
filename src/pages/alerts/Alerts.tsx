import { AlertsFeature, type AlertsAudience } from './features/Alerts'
import './Alerts.css'

interface Props {
  audience?: AlertsAudience
}

export default function Alerts({ audience = 'operator' }: Props) {
  return <AlertsFeature audience={audience} />
}
