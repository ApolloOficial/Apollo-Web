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
import { RadioCardGroup } from '../../../../../components/inputs/radio-card-group'
import { SimpleInput } from '../../../../../components/inputs/simple-input'
import { Step, Stepper } from '../../../../../components/stepper'
import { useApiResource } from '../../../../../hooks/useApiResource'
import { paths } from '../../../../../routes/paths'
import type { StepStatus } from '../../../../../types/ui.types'
import { formatKw, todayIso } from '../../../../../utils/formatters'
import { isValidIpv4, isValidPort } from '../../../../../utils/validators'
import {
  getInverterModels,
  postInverter,
  simulateInverterConnectionTest,
} from '../../../data-access/services/Branches.service'
import {
  INITIAL_INVERTER_FORM,
  INVERTER_SOURCE_LABELS,
  SUPPORTED_INVERTER_BRANDS,
  type ConnectionStatusVM,
  type InverterFormVM,
  type InverterSourceVM,
  type InverterStepVM,
} from '../../../data-access/vm/Branches.vm'
import { BranchesInverterConnectionTest } from './connection-test/BranchesInverterConnectionTest'

const SOURCE_OPTIONS = (
  Object.keys(INVERTER_SOURCE_LABELS) as InverterSourceVM[]
).map((source) => ({
  value: source,
  title: INVERTER_SOURCE_LABELS[source].title,
  description: INVERTER_SOURCE_LABELS[source].hint,
}))

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
  const [form, setForm] = useState<InverterFormVM>(INITIAL_INVERTER_FORM)
  const [step, setStep] = useState<InverterStepVM>(1)
  const [connection, setConnection] = useState<ConnectionStatusVM>('idle')
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
  const entriesCount = selectedModel
    ? selectedModel.mpptCount * selectedModel.stringsPerMppt
    : null

  const hostInvalid = form.host.trim() !== '' && !isValidIpv4(form.host)
  const portInvalid = form.port.trim() !== '' && !isValidPort(form.port)
  const canTest =
    form.source === 'CLOUD' ||
    (form.source === 'LOCAL' &&
      isValidIpv4(form.host) &&
      isValidPort(form.port))
  const testing = connection === 'testing'

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

  function changeSource(source: string) {
    setForm((current) => ({ ...current, source: source as InverterSourceVM }))
    setConnection('idle')
  }

  function changeNetwork(field: 'host' | 'port', value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    setConnection('idle')
  }

  function submitData(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedModel) {
      setFormError('Selecione um fabricante e um modelo existentes na lista.')
      return
    }

    setFormError('')
    setStep(connection === 'success' ? 3 : 2)
  }

  function editData() {
    setFormError('')
    setStep(1)
  }

  function editSource() {
    setFormError('')
    setConnection('idle')
    setStep(2)
  }

  async function testConnection() {
    setConnection('testing')

    try {
      await simulateInverterConnectionTest()
      setConnection('success')
      setStep(3)
    } catch {
      setConnection('error')
    }
  }

  async function submit() {
    if (!selectedModel) return

    setSubmitting(true)
    setFormError('')

    try {
      await postInverter({
        inverterModelId: selectedModel.id,
        code: form.code.trim(),
        serialNumber: form.serialNumber.trim(),
        installedAt: todayIso(),
        strings: [],
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

  const sourceSummary =
    form.source === 'LOCAL'
      ? `${INVERTER_SOURCE_LABELS.LOCAL.title} · ${form.host.trim()}`
      : `${INVERTER_SOURCE_LABELS.CLOUD.title} · ${INVERTER_SOURCE_LABELS.CLOUD.hint}`

  const connectionTest = (
    <BranchesInverterConnectionTest
      status={connection}
      canTest={canTest}
      entriesCount={entriesCount}
      onTest={() => void testConnection()}
    />
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
        description="Preencha os dados do inversor. Depois, cadastre as strings escolhendo este inversor como destino."
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
            onEdit={testing ? undefined : editData}
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
            title="Fonte dos dados"
            status={statusOf(2)}
            onEdit={editSource}
          >
            {step === 2 && (
              <div className="branches-inverter-source">
                <p className="branches-inverter-source__question">
                  De onde o Apollo vai ler a geração desse inversor?
                </p>

                <RadioCardGroup
                  name="inverter-source"
                  label="Fonte dos dados"
                  value={form.source}
                  options={SOURCE_OPTIONS}
                  disabled={testing}
                  onChange={changeSource}
                />

                {form.source === 'LOCAL' && (
                  <>
                    <div className="branches-inverter-source__network">
                      <SimpleInput
                        id="inverter-host"
                        label="IP"
                        placeholder="192.168.1.50"
                        value={form.host}
                        inputMode="decimal"
                        autoComplete="off"
                        invalid={hostInvalid}
                        disabled={testing}
                        onChange={(host) => changeNetwork('host', host)}
                      />

                      <SimpleInput
                        id="inverter-port"
                        label="Porta"
                        value={form.port}
                        inputMode="numeric"
                        autoComplete="off"
                        maxLength={5}
                        invalid={portInvalid}
                        disabled={testing}
                        onChange={(port) => changeNetwork('port', port)}
                      />
                    </div>

                    {(hostInvalid || portInvalid) && (
                      <p className="branches-page__error" role="alert">
                        Informe um IP válido, como 192.168.1.50, e uma porta
                        entre 1 e 65535.
                      </p>
                    )}
                  </>
                )}

                {connectionTest}
              </div>
            )}

            {step === 3 && connectionTest}
          </Step>

          <Step number={3} title="Revisão" status={statusOf(3)}>
            {step === 3 && (
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
                    <dt>Fonte de dados</dt>
                    <dd>{sourceSummary}</dd>
                  </div>
                  <div>
                    <dt>Conexão</dt>
                    <dd>Funcionando</dd>
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
          description="Agora cadastre as strings escolhendo este inversor como destino."
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
