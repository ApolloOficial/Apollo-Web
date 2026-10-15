import { Combobox } from '../../../../components/inputs/combobox'
import type { BranchFiltersVM } from '../../data-access/vm/Branches.vm'

interface Props {
  value: BranchFiltersVM
  nameOptions: string[]
  cityOptions: string[]
  onChange: (value: BranchFiltersVM) => void
  onApply: () => void
}

export function BranchesFilters({
  value,
  nameOptions,
  cityOptions,
  onChange,
  onApply,
}: Props) {
  return (
    <form
      className="branches-filters"
      onSubmit={(event) => {
        event.preventDefault()
        onApply()
      }}
    >
      <Combobox
        placeholder="Filial"
        value={value.name}
        options={nameOptions.map((name) => ({ value: name, label: name }))}
        onChange={(name) => onChange({ ...value, name })}
      />
      <Combobox
        placeholder="Cidade"
        value={value.city}
        options={cityOptions.map((city) => ({ value: city, label: city }))}
        onChange={(city) => onChange({ ...value, city })}
      />
      <button type="submit">Aplicar filtro</button>
    </form>
  )
}
