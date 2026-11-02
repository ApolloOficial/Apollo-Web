import { useMemo, useReducer } from 'react'
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
  INVERTER_DATA_SOURCE,
  SUPPORTED_INVERTER_BRANDS,
  type InverterStepVM,
} from '../../../data-access/vm/Branches.vm'
import {
  createInitialInverterFormState,
  inverterFormReducer,
} from '../../../data-access/vm/InverterForm.reducer'
import {
  toCreateStrings,
  validateInverterStrings,
} from '../../../data-access/vm/InverterStrings.vm'
import { BranchesInverterStrings } from './strings-step'
import { BranchesInverterSungrowConnection } from './sungrow-connection'

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
  const [state, dispatch] = useReducer(
    inverterFormReducer,
    undefined,
    createInitialInverterFormState,
  )
  const {
    form,
    strings,
    step,
    error: formError,
    submitting,
    succeeded: successOpen,
  } = state

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
    const brand = manufacturers.find((item) => sameText(item, value))
    const keepModel =
      !brand ||
      models.some(
        (model) => model.brand === brand && sameText(model.model, form.model),
      )

    dispatch({ type: 'CHANGE_MANUFACTURER', value, keepModel })
  }

  function submitData(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedModel) {
      dispatch({
        type: 'FAIL',
        message: 'Selecione um fabricante e um modelo existentes na lista.',
      })
      return
    }

    dispatch({ type: 'GO_TO_STEP', step: 2 })
  }

  function editData() {
    dispatch({ type: 'GO_TO_STEP', step: 1 })
  }

  function editStrings() {
    dispatch({ type: 'GO_TO_STEP', step: 2 })
  }

  function editConnection() {
    dispatch({ type: 'GO_TO_STEP', step: 3 })
  }

  function submitStrings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedModel) return

    const message = validateInverterStrings(strings, selectedModel, panelModels)

    if (message) {
      dispatch({ type: 'FAIL', message })
      return
    }

    dispatch({ type: 'GO_TO_STEP', step: 3 })
  }

  async function submit() {
    if (!selectedModel) return

    const message = validateInverterStrings(strings, selectedModel, panelModels)

    if (message) {
      dispatch({ type: 'FAIL', message })
      return
    }

    dispatch({ type: 'SUBMIT_START' })

    try {
      await postInverter({
        inverterModelId: selectedModel.id,
        code: form.code.trim(),
        serialNumber: form.serialNumber.trim(),
        installedAt: todayIso(),
        strings: toCreateStrings(strings, panelModels),
      })
      dispatch({ type: 'SUBMIT_SUCCESS' })
    } catch (cause) {
      dispatch({
        type: 'SUBMIT_FAILURE',
        message:
          cause instanceof Error
            ? cause.message
            : 'Não foi possível cadastrar o inversor.',
      })
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
                    dispatch({
                      type: 'UPDATE_FIELD',
                      field: 'code',
                      value: code,
                    })
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
                    dispatch({
                      type: 'UPDATE_FIELD',
                      field: 'model',
                      value: model,
                    })
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
                    dispatch({
                      type: 'UPDATE_FIELD',
                      field: 'serialNumber',
                      value: serialNumber,
                    })
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
                  onChange={(next) =>
                    dispatch({ type: 'SET_STRINGS', strings: next })
                  }
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
                  <Button
                    fullWidth
                    onClick={() => dispatch({ type: 'GO_TO_STEP', step: 4 })}
                  >
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
                    loading={submitting}
                    onClick={() => void submit()}
                  >
                    Cadastrar
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
