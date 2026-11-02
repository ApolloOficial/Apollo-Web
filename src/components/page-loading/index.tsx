import { Spinner } from '../spinner'
import './PageLoading.css'

export function PageLoading() {
  return (
    <div className="page-loading" role="status" aria-busy="true">
      <Spinner />
      <span className="sr-only">Carregando página</span>
    </div>
  )
}
