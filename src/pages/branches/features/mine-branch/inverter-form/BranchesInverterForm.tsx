import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import successImage from '../../../../../assets/images/relocation-success.png'
import { Button } from '../../../../../components/button'
import { FeedbackModal } from '../../../../../components/feedback-modal'
import { FormActions } from '../../../../../components/form-actions'
import { FormLayout } from '../../../../../components/form-layout'
import { InfoNote } from '../../../../../components/info-note'
import { Combobox } from '../../../../../components/inputs/combobox'
import { SimpleInput } from '../../../../../components/inputs/simple-input'
import { Step, Stepper } from '../../../../../components/stepper'
import { useApiResource } from '../../../../../hooks/useApiResource'
import { paths } from '../../../../../routes/paths'
import type { StepStatus } from '../../../../../types/ui.types'
import { formatKw, todayIso } from '../../../../../utils/formatters'
import {
  getInverterModels,
  getPanelModels,
  postInverter,
} from '../../../data-access/services/Branches.service'
import {
  INITIAL_INVERTER_FORM,
  INVERTER_DATA_SOURCE,
  SUPPORTED_INVERTER_BRANDS,
  type InverterFormVM,
  type InverterStepVM,
} from '../../../data-access/vm/Branches.vm'
import {
  createEmptyInverterString,
  toCreateStrings,
  validateInverterStrings,
  type InverterStringVM,
} from '../../../data-access/vm/InverterStrings.vm'
import { BranchesInverterStrings } from './strings-step/BranchesInverterStrings'
import { BranchesInverterSungrowConnection } from './sungrow-connection/BranchesInverterSungrowConnection'

function sameText(a: string, b: string) {
  return (
    a.trim().toLocaleLowerCase('pt-BR') === b.trim().toLocaleLowerCase('pt-BR')
  )
}

export function BranchesInverterForm() {
  const navigate = useNavigate()
  const modelsResource = useApiResource(
    getInverterModels,
    'Não foi possível carregar os modelos de inversor.',
  )
  const panelModelsResource = useApiResource(
    getPanelModels,
    'Não foi possível carregar os modelos de placa.',
  )
  const [strings, setStrings] = useState<InverterStringVM[]>([
    createEmptyInverterString(),
  ])
  const [form, setForm] = useState<InverterFormVM>(INITIAL_INVERTER_FORM)
  const [step, setStep] = useState<InverterStepVM>(1)
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)

  const models = useMemo(
    () =>
      (modelsResource.data?.content ?? []).filter((model) =>
        SUPPORTED_INVERTER_BRANDS.some((brand) => sameText(brand, model.brand)),
      ),
    [modelsResource.data],
  )
  const manufacturers = useMemo(
    () =>
      [...new Set(models.map((model) => model.brand))].sort((a, b) =>
        a.localeCompare(b, 'pt-BR'),
      ),
    [models],
  )
  const manufacturer = manufacturers.find((brand) =>
    sameText(brand, form.manufacturer),
  )
  const modelOptions = useMemo(
    () =>
      models
        .filter((model) => !manufacturer || model.brand === manufacturer)
        .map((model) => ({ value: String(model.id), label: model.model })),
    [models, manufacturer],
  )
  const selectedModel = models.find(
    (model) =>
      sameText(model.brand, form.manufacturer) &&
      sameText(model.model, form.model),
  )
  const panelModels = panelModelsResource.data?.content ?? []
  const entriesCount = selectedModel
    ? selectedModel.mpptCount * selectedModel.stringsPerMppt
    : null

  const listPath = `${paths.branches}?tab=mine`

  function statusOf(number: InverterStepVM): StepStatus {
    if (number === step) return 'active'

    return number < step ? 'done' : 'pending'
  }

  function changeManufacturer(value: string) {
    setForm((current) => {
      const brand = manufacturers.find((item) => sameText(item, value))
      const keepModel =
        !brand ||
        models.some(
          (model) =>
            model.brand === brand && sameText(model.model, current.model),
        )

      return {
        ...current,
        manufacturer: value,
        model: keepModel ? current.model : '',
      }
    })
  }

  function submitData(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedModel) {
      setFormError('Selecione um fabricante e um modelo existentes na lista.')
      return
    }

    setFormError('')
    setStep(2)
  }

  function editData() {
    setFormError('')
    setStep(1)
  }

  function editStrings() {
    setFormError('')
    setStep(2)
  }

  function editConnection() {
    setFormError('')
    setStep(3)
  }

  function submitStrings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedModel) return

    const message = validateInverterStrings(
      strings,
      selectedModel,
      panelModels,
    )

    if (message) {
      setFormError(message)
      return
    }

    setFormError('')
    setStep(3)
  }

  async function submit() {
    if (!selectedModel) return

    const message = validateInverterStrings(
      strings,
      selectedModel,
      panelModels,
    )

    if (message) {
      setFormError(message)
      return
    }

    setSubmitting(true)
    setFormError('')

    try {
      await postInverter({
        inverterModelId: selectedModel.id,
        code: form.code.trim(),
        serialNumber: form.serialNumber.trim(),
        installedAt: todayIso(),
        strings: toCreateStrings(strings, panelModels),
      })
      setSuccessOpen(true)
    } catch (cause) {
      setFormError(
        cause instanceof Error
          ? cause.message
          : 'Não foi possível cadastrar o inversor.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const sungrowConnection = (
    <BranchesInverterSungrowConnection serialNumber={form.serialNumber} />
  )

  return (
    <>
      <FormLayout
        breadcrumb={[
          { label: 'Início', to: paths.home },
          { label: 'Filiais', to: listPath },
          { label: 'Inversores', to: listPath },
          { label: 'Cadastrar novo inversor' },
        ]}
        title="Cadastre um novo inversor"
        description="Preencha os dados do inversor e informe ao menos uma string com suas placas."
      >
        {modelsResource.error && (
          <p className="branches-page__error" role="alert">
            {modelsResource.error}
          </p>
        )}

        <InfoNote title="Somente inversores Sungrow">
          Por enquanto, o Apollo se conecta apenas a inversores da Sungrow.
          Outras marcas serão adicionadas no futuro.
        </InfoNote>

        <Stepper>
          <Step
            number={1}
            title="Dados do inversor"
            status={statusOf(1)}
            onEdit={editData}
          >
            {step === 1 && (
              <form className="branches-inverter-form" onSubmit={submitData}>
                <SimpleInput
                  id="inverter-code"
                  label="Apelido"
                  placeholder="Digite um apelido para o inversor"
                  value={form.code}
                  maxLength={30}
                  required
                  onChange={(code) =>
                    setForm((current) => ({ ...current, code }))
                  }
                />

                <Combobox
                  required
                  label="Fabricante"
                  placeholder="Digite o nome do fabricante do inversor"
                  value={form.manufacturer}
                  options={manufacturers.map((brand) => ({
                    value: brand,
                    label: brand,
                  }))}
                  onChange={changeManufacturer}
                />

                <Combobox
                  required
                  label="Modelo"
                  placeholder="Digite o modelo do inversor"
                  value={form.model}
                  options={modelOptions}
                  onChange={(model) =>
                    setForm((current) => ({ ...current, model }))
                  }
                />

                <SimpleInput
                  id="inverter-serial"
                  label="Número de série"
                  placeholder="Código na etiqueta lateral do inversor"
                  value={form.serialNumber}
                  maxLength={60}
                  required
                  onChange={(serialNumber) =>
                    setForm((current) => ({ ...current, serialNumber }))
                  }
                />

                {formError && (
                  <p className="branches-page__error" role="alert">
                    {formError}
                  </p>
                )}

                <FormActions>
                  <Button
                    type="submit"
                    fullWidth
                    disabled={modelsResource.loading}
                  >
                    Continuar
                  </Button>
                </FormActions>
              </form>
            )}
          </Step>

          <Step
            number={2}
            title="Strings e placas"
            status={statusOf(2)}
            onEdit={editStrings}
          >
            {step === 2 && (
              <form className="branches-inverter-form" onSubmit={submitStrings}>
                <BranchesInverterStrings
                  strings={strings}
                  panelModels={panelModels}
                  maxStrings={entriesCount}
                  onChange={setStrings}
                />

                {panelModelsResource.error && (
                  <p className="branches-page__error" role="alert">
                    {panelModelsResource.error}
                  </p>
                )}

                {formError && (
                  <p className="branches-page__error" role="alert">
                    {formError}
                  </p>
                )}

                <FormActions>
                  <Button
                    type="submit"
                    fullWidth
                    disabled={panelModelsResource.loading}
                  >
                    Continuar
                  </Button>
                </FormActions>
              </form>
            )}
          </Step>

          <Step
            number={3}
            title="Conexão com a Sungrow"
            status={statusOf(3)}
            onEdit={editConnection}
          >
            {step === 3 && (
              <div className="branches-inverter-source">
                {sungrowConnection}

                <FormActions>
                  <Button fullWidth onClick={() => setStep(4)}>
                    Continuar
                  </Button>
                </FormActions>
              </div>
            )}

            {step === 4 && sungrowConnection}
          </Step>

          <Step number={4} title="Revisão" status={statusOf(4)}>
            {step === 4 && (
              <>
                <dl className="branches-info branches-info--review">
                  <div>
                    <dt>Apelido</dt>
                    <dd>{form.code.trim()}</dd>
                  </div>
                  <div>
                    <dt>Equipamento</dt>
                    <dd>
                      {selectedModel
                        ? `${selectedModel.brand} ${selectedModel.model} · ${formatKw(selectedModel.ratedPowerKw)}`
                        : '-'}
                    </dd>
                  </div>
                  <div>
                    <dt>Número de série</dt>
                    <dd>{form.serialNumber.trim()}</dd>
                  </div>
                  <div>
                    <dt>Strings</dt>
                    <dd>{strings.length}</dd>
                  </div>
                  <div>
                    <dt>Fonte de dados</dt>
                    <dd>{INVERTER_DATA_SOURCE}</dd>
                  </div>
                  <div>
                    <dt>Entradas</dt>
                    <dd>
                      {entriesCount === null
                        ? '-'
                        : `${entriesCount} ${entriesCount === 1 ? 'livre' : 'livres'}`}
                    </dd>
                  </div>
                </dl>

                {formError && (
                  <p className="branches-page__error" role="alert">
                    {formError}
                  </p>
                )}

                <FormActions>
                  <Button
                    fullWidth
                    disabled={submitting}
                    onClick={() => void submit()}
                  >
                    {submitting ? 'Cadastrando...' : 'Cadastrar'}
                  </Button>
                </FormActions>
              </>
            )}
          </Step>
        </Stepper>
      </FormLayout>

      {successOpen && (
        <FeedbackModal
          image={successImage}
          title={'Inversor cadastrado\ncom sucesso!'}
          description="As strings e as placas informadas foram cadastradas junto com o inversor."
          primaryAction={{
            label: 'Ver inversores',
            onClick: () => navigate(listPath),
          }}
          onClose={() => navigate(listPath)}
        />
      )}
    </>
  )
}
