import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Combobox } from '../../../../components/inputs/combobox'
import { SelectInput } from '../../../../components/inputs/select-input'
import type { CompanyDTO, CompanyUnitDTO, MeDTO, PanelDTO, SegmentDTO, StringDTO } from '../../data-access/dto/Relocations.dto'
import { getCompanies, getCompanyUnits, getMe, getPanels, getSegments, getStrings,
  postExternalRelocation, postInternalRelocation } from '../../data-access/services/Relocations.service'
import { INITIAL_EXTERNAL_FORM, INITIAL_INTERNAL_FORM } from '../../data-access/vm/Relocations.vm'

interface Props { onSuccess: () => void; onError: (message: string) => void }

export function RelocationsForm({ onSuccess, onError }: Props) {
  const [type, setType] = useState<'INTERNAL' | 'EXTERNAL'>('INTERNAL')
  const [me, setMe] = useState<MeDTO | null>(null)
  const [units, setUnits] = useState<CompanyUnitDTO[]>([])
  const [companies, setCompanies] = useState<CompanyDTO[]>([])
  const [segments, setSegments] = useState<SegmentDTO[]>([])
  const [strings, setStrings] = useState<StringDTO[]>([])
  const [panels, setPanels] = useState<PanelDTO[]>([])
  const [internal, setInternal] = useState(INITIAL_INTERNAL_FORM)
  const [external, setExternal] = useState(INITIAL_EXTERNAL_FORM)
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => {
    async function prepare() {
      setLoadingOptions(true); setLoadError('')
      try {
        const user = await getMe()
        setMe(user)
        const [unitPage, companyPage, segmentPage, stringPage, panelPage] = await Promise.all([
          getCompanyUnits(), getCompanies(), getSegments(), getStrings(user.companyUnitId), getPanels(user.companyUnitId),
        ])
        setUnits(unitPage.content.filter((item) => item.id !== user.companyUnitId))
        setCompanies(companyPage.content.filter((item) => item.id !== user.companyId))
        setSegments(segmentPage.content); setStrings(stringPage.content); setPanels(panelPage.content)
      } catch (cause) { setLoadError(cause instanceof Error ? cause.message : 'Não foi possível carregar os dados.') }
      finally { setLoadingOptions(false) }
    }
    void prepare()
  }, [])

  const unit = useMemo(() => units.find((item) => item.name === internal.destinationUnitName), [units, internal.destinationUnitName])
  const string = useMemo(() => strings.find((item) => item.code === internal.stringCode), [strings, internal.stringCode])
  const company = useMemo(() => companies.find((item) => item.name === external.destinationCompanyName), [companies, external.destinationCompanyName])
  const segment = useMemo(() => segments.find((item) => item.name === external.segmentName), [segments, external.segmentName])
  const panel = useMemo(() => panels.find((item) => `${item.stringCode} — ${item.serialNumber}` === external.panelLabel), [panels, external.panelLabel])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setFormError('')
    if (!me) return setFormError('Os dados do usuário não foram carregados.')
    if (type === 'INTERNAL' && (!unit || !string || Number(internal.quantity) <= 0 || !internal.justification.trim()))
      return setFormError('Preencha filial, string, quantidade e justificativa válidas.')
    if (type === 'EXTERNAL' && (!company || !segment || !panel || !external.justification.trim()))
      return setFormError('Preencha empresa, segmento, placa e justificativa válidos.')

    setSubmitting(true)
    try {
      if (type === 'INTERNAL' && unit && string) {
        await postInternalRelocation({ stringId: string.id, quantity: Number(internal.quantity),
          suggestedUnitId: unit.id, justification: internal.justification.trim() })
      } else if (type === 'EXTERNAL' && company && segment && panel) {
        await postExternalRelocation({ panelId: panel.id, destinationCompanyId: company.id,
          segmentId: segment.id, justification: external.justification.trim() })
      }
      onSuccess()
    } catch (cause) { onError(cause instanceof Error ? cause.message : 'Não foi possível registrar a solicitação.') }
    finally { setSubmitting(false) }
  }

  return <form className="relocation-form" onSubmit={(event) => void submit(event)}>
    <SelectInput label="Tipo" placeholder="Tipo" value={type} disabled={loadingOptions}
      options={[{ value: 'INTERNAL', label: 'Interna' }, { value: 'EXTERNAL', label: 'Externa' }]}
      onChange={(value) => { setType(value as 'INTERNAL' | 'EXTERNAL'); setFormError('') }} />
    {type === 'INTERNAL' ? <>
      <label>Filial de origem<input className="prefilled" value={me?.companyUnitName ?? ''} readOnly /></label>
      <Combobox label="Filial de destino" placeholder="Digite o nome da filial de destino" value={internal.destinationUnitName}
        options={units.map((item) => ({ value: item.id, label: item.name }))}
        onChange={(value) => setInternal({ ...internal, destinationUnitName: value })} />
      <Combobox label="String" placeholder="Digite o número da string" value={internal.stringCode}
        options={strings.map((item) => ({ value: item.id, label: item.code }))}
        onChange={(value) => setInternal({ ...internal, stringCode: value })} />
      <label>Quantidade de placas<input required type="number" min={1} step={1} value={internal.quantity}
        onChange={(event) => setInternal({ ...internal, quantity: event.target.value })} /></label>
      <label>Justificativa<textarea required value={internal.justification} placeholder="Descreva o motivo aqui"
        onChange={(event) => setInternal({ ...internal, justification: event.target.value })} /></label>
    </> : <>
      <label>Empresa de origem<input className="prefilled" value={me?.companyName ?? ''} readOnly /></label>
      <Combobox label="Empresa de destino" placeholder="Digite o nome da empresa de destino" value={external.destinationCompanyName}
        options={companies.map((item) => ({ value: String(item.id), label: item.name }))}
        onChange={(value) => setExternal({ ...external, destinationCompanyName: value })} />
      <Combobox label="Segmento" placeholder="Digite o segmento da empresa de destino" value={external.segmentName}
        options={segments.map((item) => ({ value: String(item.id), label: item.name }))}
        onChange={(value) => setExternal({ ...external, segmentName: value })} />
      <Combobox label="String" placeholder="Digite o número da string ou placa" value={external.panelLabel}
        options={panels.map((item) => ({ value: String(item.id), label: `${item.stringCode} — ${item.serialNumber}` }))}
        onChange={(value) => setExternal({ ...external, panelLabel: value })} />
      <label>Justificativa<textarea required value={external.justification} placeholder="Descreva o motivo aqui"
        onChange={(event) => setExternal({ ...external, justification: event.target.value })} /></label>
    </>}
    {loadError && <p className="relocations-error" role="alert">{loadError}</p>}
    {formError && <p className="relocations-error" role="alert">{formError}</p>}
    <button className="relocation-form__submit" disabled={loadingOptions || submitting || !me || Boolean(loadError)}>
      {submitting ? 'Solicitando...' : 'Solicitar'}
    </button>
  </form>
}
