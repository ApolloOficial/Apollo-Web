import { SelectInput } from '../../../../components/inputs/select-input'
import type { RelocationFiltersVM } from '../../data-access/vm/Relocations.vm'

interface Props {
  hideType?: boolean
  value: RelocationFiltersVM
  onChange: (value: RelocationFiltersVM) => void
  onApply: () => void
}

export function RelocationsFilters({
  hideType = false,
  value,
  onChange,
  onApply,
}: Props) {
  return (
    <div
      className={`filter-bar relocations-filters${hideType ? ' relocations-filters--compact' : ''}`}
    >
      <SelectInput
        placeholder="Status"
        value={value.status}
        options={[
          { value: 'ALL', label: 'Todos' },
          { value: 'PENDENTE', label: 'Pendente' },
          { value: 'APROVADA', label: 'Aprovada' },
          { value: 'REJEITADA', label: 'Rejeitada' },
          { value: 'CONCLUIDA', label: 'Concluída' },
        ]}
        onChange={(status) =>
          onChange({
            ...value,
            status: status as RelocationFiltersVM['status'],
          })
        }
      />

      {!hideType && (
        <SelectInput
          placeholder="Tipo"
          value={value.type}
          options={[
            { value: 'ALL', label: 'Todos' },
            { value: 'INTERNAL', label: 'Interna' },
            { value: 'EXTERNAL', label: 'Externa' },
          ]}
          onChange={(type) =>
            onChange({
              ...value,
              type: type as RelocationFiltersVM['type'],
            })
          }
        />
      )}

      <button type="button" onClick={onApply}>
        Aplicar filtro
      </button>
    </div>
  )
}
