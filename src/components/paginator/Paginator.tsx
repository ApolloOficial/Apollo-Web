import { Icon } from '@iconify/react'
import './Paginator.css'

interface PaginatorProps {
  page: number
  totalPages: number
  size: number
  onPageChange: (page: number) => void
  onSizeChange: (size: number) => void
}

export function Paginator({
  page,
  totalPages,
  size,
  onPageChange,
  onSizeChange,
}: PaginatorProps) {
  const hasPreviousPage = page > 0
  const hasNextPage = page + 1 < totalPages

  return (
    <nav className="paginator" aria-label="Paginação">
      <label className="paginator__size">
        Mostrar:
        <select
          value={size}
          onChange={(event) => onSizeChange(Number(event.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </label>

      <span>Página {totalPages > 0 ? page + 1 : 0} de {totalPages}</span>

      <button
        className="paginator__button paginator__button--previous"
        type="button"
        aria-label="Página anterior"
        disabled={!hasPreviousPage}
        onClick={() => onPageChange(page - 1)}
      >
        <Icon icon="lucide:circle-chevron-right" aria-hidden="true" />
      </button>

      <button
        className="paginator__button"
        type="button"
        aria-label="Próxima página"
        disabled={!hasNextPage}
        onClick={() => onPageChange(page + 1)}
      >
        <Icon icon="lucide:circle-chevron-right" aria-hidden="true" />
      </button>
    </nav>
  )
}