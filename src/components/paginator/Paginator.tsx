import { Icon } from '@iconify/react'
import { SelectInput } from '../inputs/select-input'
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
      <div className="paginator__size">
        <span>Mostrar:</span>

        <div className="paginator__size-select">
          <SelectInput
            placeholder="10"
            value={String(size)}
            options={[
              { value: '10', label: '10' },
              { value: '20', label: '20' },
              { value: '50', label: '50' },
            ]}
            onChange={(value) => onSizeChange(Number(value))}
          />
        </div>
      </div>

      <span className="paginator__page">
        Página {totalPages > 0 ? page + 1 : 0} de {totalPages}
      </span>

      <button
        className="paginator__button paginator__button--previous"
        type="button"
        aria-label="Página anterior"
        disabled={!hasPreviousPage}
        onClick={() => onPageChange(page - 1)}
      >
        <Icon
          icon="lucide:circle-chevron-right"
          aria-hidden="true"
        />
      </button>

      <button
        className="paginator__button"
        type="button"
        aria-label="Próxima página"
        disabled={!hasNextPage}
        onClick={() => onPageChange(page + 1)}
      >
        <Icon
          icon="lucide:circle-chevron-right"
          aria-hidden="true"
        />
      </button>
    </nav>
  )
}