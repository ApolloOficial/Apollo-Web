import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../../../components/button'
import { FeedbackModal } from '../../../components/feedback-modal'
import { FormActions } from '../../../components/form-actions'
import { FormLayout } from '../../../components/form-layout'
import { Combobox } from '../../../components/inputs/combobox'
import { DatePicker } from '../../../components/inputs/date-picker'
import { SelectInput } from '../../../components/inputs/select-input'
import { SimpleInput } from '../../../components/inputs/simple-input'
import { TextareaInput } from '../../../components/inputs/textarea-input'
import { paths } from '../../../routes/paths'
import errorImage from '../../../assets/images/relocation-error.png'
import successImage from '../../../assets/images/relocation-success.png'
import type {
  EmployeeSummaryDto,
  MaintenanceTypeDto,
  WarningDto,
} from '../../alerts/data-access/dto/Alerts.dto'
import {
  getActiveTechnicians,
  getMaintenanceTypes,
  getWarning,
  postServiceOrder,
} from '../../alerts/data-access/services/Alerts.service'
import { severityLabels } from '../../alerts/data-access/vm/Alerts.vm'

type ModalState = 'success' | 'error' | null

function noop() {}

function todayIso() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

export default function ServiceOrderForm() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [warning, setWarning] = useState<WarningDto | null>(null)
  const [technicians, setTechnicians] = useState<EmployeeSummaryDto[]>([])
  const [maintenanceTypes, setMaintenanceTypes] = useState<
    MaintenanceTypeDto[]
  >([])

  const [technicianName, setTechnicianName] = useState('')
  const [maintenanceTypeId, setMaintenanceTypeId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [modal, setModal] = useState<ModalState>(null)

  useEffect(() => {
    let active = true

    void (async () => {
      await Promise.resolve()

      if (!active) return

      if (!id || Number.isNaN(Number(id))) {
        setError('Alerta inválido.')
        setLoading(false)
        return
      }

      try {
        const warningResult = await getWarning(Number(id))
        const [techniciansResult, typesResult] = await Promise.all([
          getActiveTechnicians(warningResult.companyUnitId),
          getMaintenanceTypes(),
        ])

        if (!active) return

        setWarning(warningResult)
        setTechnicians(techniciansResult.content)
        setMaintenanceTypes(typesResult)
      } catch (cause: unknown) {
        if (!active) return

        setError(
          cause instanceof Error
            ? cause.message
            : 'Não foi possível carregar os dados da OS.',
        )
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    })()

    return () => {
      active = false
    }
  }, [id])

  const technicianOptions = useMemo(
    () =>
      technicians.map((technician) => ({
        value: technician.id,
        label: technician.fullName,
      })),
    [technicians],
  )

  const selectedTechnician = technicians.find(
    (technician) => technician.fullName === technicianName,
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!warning || !selectedTechnician || !maintenanceTypeId) {
      setError('Preencha todos os campos obrigatórios.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      await postServiceOrder(warning.id, {
        maintenanceTypeId: Number(maintenanceTypeId),
        technicianId: selectedTechnician.id,
        dueDate: dueDate ? `${dueDate}T23:59:59` : null,
      })

      setModal('success')
    } catch {
      setModal('error')
    } finally {
      setSubmitting(false)
    }
  }

  const breadcrumb = [
    { label: 'Início', to: paths.home },
    { label: 'Alertas', to: paths.alerts },
    { label: 'Registrar OS' },
  ]

  if (loading) {
    return <p>Carregando...</p>
  }

  if (!warning) {
    return (
      <FormLayout breadcrumb={breadcrumb} title="Registrar Ordem de Serviço">
        <p className="form-layout__error" role="alert">
          {error}
        </p>
      </FormLayout>
    )
  }

  return (
    <>
      <FormLayout
        breadcrumb={breadcrumb}
        title="Registrar Ordem de Serviço"
        description="Preencha todos os dados."
      >
        <form className="form-layout__form" onSubmit={handleSubmit}>
          <SimpleInput
            id="service-order-string"
            label="String"
            value={warning.stringCode ?? warning.inverterCode ?? '—'}
            readOnly
            onChange={noop}
          />

          <SimpleInput
            id="service-order-panel"
            label="Placa"
            value={warning.panelSerial ?? 'Todas as placas'}
            readOnly
            onChange={noop}
          />

          <SimpleInput
            id="service-order-priority"
            label="Prioridade"
            value={severityLabels[warning.severity]}
            readOnly
            onChange={noop}
          />

          <SelectInput
            label="Tipo de manutenção"
            placeholder="Selecione o tipo de manutenção"
            value={maintenanceTypeId}
            options={maintenanceTypes.map((type) => ({
              value: String(type.id),
              label: type.name,
            }))}
            onChange={setMaintenanceTypeId}
          />

          <Combobox
            label="Técnico responsável"
            placeholder="Digite o nome do técnico responsável"
            value={technicianName}
            options={technicianOptions}
            required
            onChange={setTechnicianName}
          />

          <DatePicker
            label="Prazo de conclusão"
            value={dueDate}
            min={todayIso()}
            required
            onChange={setDueDate}
          />

          <TextareaInput
            id="service-order-description"
            label="Descrição"
            value={warning.message}
            readOnly
          />

          {error && (
            <p className="form-layout__error" role="alert">
              {error}
            </p>
          )}

          <FormActions>
            <Button type="submit" fullWidth disabled={submitting}>
              {submitting ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </FormActions>
        </form>
      </FormLayout>

      {modal === 'success' && (
        <FeedbackModal
          image={successImage}
          title="OS registrada com sucesso"
          description="A ordem de serviço já está disponível para acompanhamento."
          primaryAction={{
            label: 'Voltar para alertas',
            onClick: () => navigate(paths.alerts),
          }}
          onClose={() => navigate(paths.alerts)}
        />
      )}

      {modal === 'error' && (
        <FeedbackModal
          image={errorImage}
          title="Não foi possível registrar a OS"
          description="Aguarde alguns minutos e tente novamente."
          alert
          primaryAction={{
            label: 'Tentar novamente',
            onClick: () => setModal(null),
          }}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}
