import { Icon } from '@iconify/react'
import './AppliedFilters.css'

export interface AppliedFilter {
  key: string
  label: string
  value: string
}

interface Props {
  filters: AppliedFilter[]
  onRemove: (key: string) => void
  onClear: () => void
}

export function AppliedFilters({
  filters,
  onRemove,
  onClear,
}: Props) {
  if (filters.length === 0) return null

  return (
    <div
      className="applied-filters"
      aria-label="Filtros aplicados"
    >
      <button
        className="applied-filters__item applied-filters__clear"
        type="button"
        onClick={onClear}
      >
        <span>Limpar todos os filtros</span>

        <Icon
          icon="lucide:x"
          aria-hidden="true"
        />
      </button>

      {filters.map((filter) => (
        <button
          className="applied-filters__item"
          type="button"
          key={filter.key}
          aria-label={`Remover filtro ${filter.label}: ${filter.value}`}
          onClick={() => onRemove(filter.key)}
        >
          <span>
            <strong>{filter.label}:</strong> {filter.value}
          </span>

          <Icon
            icon="lucide:x"
            aria-hidden="true"
          />
        </button>
      ))}
    </div>
  )
}