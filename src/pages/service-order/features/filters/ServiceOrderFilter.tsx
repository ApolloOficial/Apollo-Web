import { Combobox } from '../../../../components/inputs/combobox'
import { SelectInput } from '../../../../components/inputs/select-input'
import type {
    EmployeeSummaryDto,
    MaintenanceTypeDto,
} from '../../data-access/dto/ServiceOrder.dto'
import type {
    ServiceOrderFiltersViewModel,
} from '../../data-access/vm/ServiceOrder.vm'

interface Props {
    value: ServiceOrderFiltersViewModel
    orderIds: number[]
    technicians: EmployeeSummaryDto[]
    maintenanceTypes: MaintenanceTypeDto[]
    onChange: (value: ServiceOrderFiltersViewModel) => void
    onApply: () => void
}

export function ServiceOrderFilter({
    value,
    orderIds,
    technicians,
    maintenanceTypes,
    onChange,
    onApply,
}: Props) {
    function changeTechnician(technicianName: string) {
        const technician = technicians.find(
            (item) => item.fullName === technicianName,
        )

        onChange({
            ...value,
            technicianName,
            technicianId: technician?.id ?? '',
        })
    }

    return (
        <div className="service-orders-filters">
        <div className="service-orders-filters__field service-orders-filters__field--id">
            <Combobox
                placeholder="ID"
                value={value.idLabel}
                options={orderIds.map((id) => ({
                    value: String(id),
                    label: `OS${String(id).padStart(5, '0')}`,
                }))}
                onChange={(idLabel) => {
                    const selectedId = orderIds.find(
                        (id) => `OS${String(id).padStart(5, '0')}` === idLabel,
                    )

                    onChange({
                        ...value,
                        idLabel,
                        id: selectedId ? String(selectedId) : idLabel.replace(/\D/g, ''),
                    })
                }}
            />
        </div>



            <div className="service-orders-filters__field service-orders-filters__field--technician">
                <Combobox
                    placeholder="Técnico"
                    value={value.technicianName}
                    options={technicians.map((technician) => ({
                        value: technician.id,
                        label: technician.fullName,
                    }))}
                    onChange={changeTechnician}
                />
            </div>

            <div className="service-orders-filters__field service-orders-filters__field--type">
                <SelectInput
                    placeholder="Tipo"
                    value={value.maintenanceTypeId}
                    options={[
                        { value: '', label: 'Todos' },
                        ...maintenanceTypes.map((type) => ({
                            value: String(type.id),
                            label: type.name,
                        })),
                    ]}
                    onChange={(maintenanceTypeId) =>
                        onChange({
                            ...value,
                            maintenanceTypeId,
                        })
                    }
                />
            </div>

            <div className="service-orders-filters__field service-orders-filters__field--status">
                <SelectInput
                    placeholder="Status"
                    value={value.status}
                    options={[
                        { value: '', label: 'Todos' },
                        { value: 'ABERTA', label: 'Aberta' },
                        { value: 'EM_ANDAMENTO', label: 'Ativo' },
                        { value: 'CONCLUIDA', label: 'Concluída' },
                        { value: 'CANCELADA', label: 'Cancelada' },
                    ]}
                    onChange={(status) =>
                        onChange({
                            ...value,
                            status:
                                status as ServiceOrderFiltersViewModel['status'],
                        })
                    }
                />
            </div>

            <div className="service-orders-filters__field service-orders-filters__field--period">
                <SelectInput
                    placeholder="Período"
                    value={value.period}
                    options={[
                        { value: '', label: 'Todos' },
                        { value: 'THIS_MONTH', label: 'Este mês' },
                        { value: 'OVERDUE', label: 'Atrasadas' },
                    ]}
                    onChange={(period) =>
                        onChange({
                            ...value,
                            period:
                                period as ServiceOrderFiltersViewModel['period'],
                        })
                    }
                />
            </div>

            <div className="service-orders-filters__field service-orders-filters__field--priority">
                <SelectInput
                    placeholder="Prioridade"
                    value={value.priority}
                    options={[
                        { value: '', label: 'Todas' },
                        { value: 'BAIXA', label: 'Baixa' },
                        { value: 'MEDIA', label: 'Média' },
                        { value: 'ALTA', label: 'Alta' },
                        { value: 'CRITICA', label: 'Crítica' },
                    ]}
                    onChange={(priority) =>
                        onChange({
                            ...value,
                            priority:
                                priority as ServiceOrderFiltersViewModel['priority'],
                        })
                    }
                />
            </div>

            <button
                className="service-orders-filters__apply"
                type="button"
                onClick={onApply}
            >
                Aplicar filtro
            </button>
        </div>
        
    )
}