import {
  RelocationsFeature,
  type RelocationsAudience,
} from './features/Relocations'
import './Relocations.css'

export default function Relocations({
  audience = 'operator',
}: {
  audience?: RelocationsAudience
}) {
  return <RelocationsFeature audience={audience} />
}
