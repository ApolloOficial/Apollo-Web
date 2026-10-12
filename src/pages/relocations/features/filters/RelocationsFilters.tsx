import { SelectInput } from '../../../../components/inputs/select-input'
import type { RelocationFiltersVM } from '../../data-access/vm/Relocations.vm'

interface Props { value: RelocationFiltersVM; onChange: (value: RelocationFiltersVM) => void; onApply: () => void }

export function RelocationsFilters({ value, onChange, onApply }: Props) {
  return <form className="relocations-filters" onSubmit={(event) => { event.preventDefault(); onApply() }}>
    <SelectInput placeholder="Status" value={value.status}
      options={[{ value: '', label: 'Todos' }, { value: 'PENDENTE', label: 'Pendente' },
        { value: 'APROVADA', label: 'Aprovada' }, { value: 'REJEITADA', label: 'Rejeitada' },
        { value: 'CONCLUIDA', label: 'Concluída' }]}
      onChange={(status) => onChange({ ...value, status: status as RelocationFiltersVM['status'] })} />
    <SelectInput placeholder="Tipo" value={value.type}
      options={[{ value: '', label: 'Todos' }, { value: 'INTERNAL', label: 'Interna' }, { value: 'EXTERNAL', label: 'Externa' }]}
      onChange={(type) => onChange({ ...value, type: type as RelocationFiltersVM['type'] })} />
    <button type="submit">Aplicar filtro</button>
  </form>
}
