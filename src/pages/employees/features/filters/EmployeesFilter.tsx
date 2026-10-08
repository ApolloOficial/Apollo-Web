import { Combobox } from '../../../../components/inputs/combobox'
import type { RoleDTO } from '../../data-access/dto/Employees.dto'
import { SelectInput } from '../../../../components/inputs/select-input'
import type { EmployeeFiltersVM } from '../../data-access/vm/Employees.vm'

interface Props {
  value: EmployeeFiltersVM
  roles: RoleDTO[]
  emailOptions: string[]
  onChange: (value: EmployeeFiltersVM) => void
  onApply: () => void
}

export function EmployeesFilter({ value, roles, emailOptions, onChange, onApply }: Props) {
  return (
    <form className="employees-filters" onSubmit={(event) => { event.preventDefault(); onApply() }}>
      {/* Sem seta: comboboxes pesquisáveis. */}
      <Combobox placeholder="E-mail" value={value.email}
        options={emailOptions.map((email) => ({ value: email, label: email }))}
        onChange={(email) => onChange({ ...value, email })} />
      <Combobox placeholder="Cargo" value={value.role}
        options={roles.map((role) => ({ value: String(role.id), label: role.name }))}
        onChange={(role) => onChange({ ...value, role })} />
      {/* Com seta: dropdown. */}
      <SelectInput placeholder="Ativo" value={value.isActive}
        options={[{ value: '', label: 'Todos' },{ value: 'true', label: 'Ativo' },{ value: 'false', label: 'Inativo' },]}  
        onChange={(isActive) =>
                    onChange({...value, isActive: isActive as EmployeeFiltersVM['isActive'],})}
/>
      <button type="submit">Aplicar filtro</button>
    </form>
  )
}