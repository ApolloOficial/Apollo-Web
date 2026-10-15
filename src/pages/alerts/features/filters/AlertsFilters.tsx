import { SelectInput } from '../../../../components/inputs/select-input'
import type { AlertsFiltersViewModel } from '../../data-access/vm/Alerts.vm'

interface Props {
  value: AlertsFiltersViewModel
  onChange: (value: AlertsFiltersViewModel) => void
  onApply: () => void
}

export function AlertsFilters({ value, onChange, onApply }: Props) {
  return (
    <div className="filter-bar alerts-filters">
      <SelectInput
        placeholder="Severidade"
        value={value.severity}
        options={[
          { value: 'ALL', label: 'Todas' },
          { value: 'BAIXA', label: 'Baixa' },
          { value: 'MEDIA', label: 'Média' },
          { value: 'ALTA', label: 'Alta' },
          { value: 'CRITICA', label: 'Crítica' },
        ]}
        onChange={(severity) =>
          onChange({
            ...value,
            severity: severity as AlertsFiltersViewModel['severity'],
          })
        }
      />

      <SelectInput
        placeholder="Tipo/Origem"
        value={value.type}
        options={[
          { value: 'ALL', label: 'Todos' },
          {
            value: 'EFICIENCIA_BAIXA',
            label: 'Eficiência baixa',
          },
          {
            value: 'FALHA_INVERSOR',
            label: 'Falha no inversor',
          },
          { value: 'DANO_FISICO', label: 'Dano físico' },
          { value: 'SUJIDADE', label: 'Sujidade' },
          { value: 'PONTO_QUENTE', label: 'Ponto quente' },
          { value: 'CONEXAO', label: 'Conexão' },
        ]}
        onChange={(type) =>
          onChange({
            ...value,
            type: type as AlertsFiltersViewModel['type'],
          })
        }
      />

      <SelectInput
        placeholder="Status"
        value={value.status}
        options={[
          { value: 'ALL', label: 'Todos' },
          { value: 'ATIVO', label: 'Ativo' },
          { value: 'RECONHECIDO', label: 'Reconhecido' },
          { value: 'RESOLVIDO', label: 'Resolvido' },
        ]}
        onChange={(status) =>
          onChange({
            ...value,
            status: status as AlertsFiltersViewModel['status'],
          })
        }
      />

      <button type="button" onClick={onApply}>
        Aplicar filtro
      </button>
    </div>
  )
}
