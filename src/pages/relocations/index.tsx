import { useSearchParams } from 'react-router-dom'
import { relocationFiltersFromParams } from './data-access/vm/Relocations.vm'
import {
  RelocationsFeature,
  type RelocationsAudience,
} from './features'
import './Relocations.css'

export default function Relocations({
  audience = 'operator',
}: {
  audience?: RelocationsAudience
}) {
  const [params] = useSearchParams()

  return (
    <RelocationsFeature
      key={params.toString()}
      audience={audience}
      initialFilters={relocationFiltersFromParams(params)}
    />
  )
}
