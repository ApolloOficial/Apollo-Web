import { Button } from '../../../../../../components/button'
import { Combobox } from '../../../../../../components/inputs/combobox'
import { DatePicker } from '../../../../../../components/inputs/date-picker'
import { SimpleInput } from '../../../../../../components/inputs/simple-input'
import type { PanelModelDto } from '../../../../../../types/panel.types'
import {
  createEmptyInverterPanel,
  createEmptyInverterString,
  panelModelLabel,
  type InverterStringVM,
} from '../../../../data-access/vm/InverterStrings.vm'

interface Props {
  strings: InverterStringVM[]
  panelModels: PanelModelDto[]
  maxStrings: number | null
  onChange: (strings: InverterStringVM[]) => void
}

export function BranchesInverterStrings({
  strings,
  panelModels,
  maxStrings,
  onChange,
}: Props) {
  function updateString(index: number, patch: Partial<InverterStringVM>) {
    onChange(
      strings.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    )
  }

  function updatePanel(
    stringIndex: number,
    panelIndex: number,
    patch: Partial<InverterStringVM['panels'][number]>,
  ) {
    updateString(stringIndex, {
      panels: strings[stringIndex].panels.map((panel, i) =>
        i === panelIndex ? { ...panel, ...patch } : panel,
      ),
    })
  }

  const canAdd = maxStrings === null || strings.length < maxStrings

  return (
    <div className="branches-inverter-strings">
      {strings.map((item, index) => (
        <fieldset className="branches-inverter-strings__item" key={item.uid}>
          <legend>String {index + 1}</legend>

          <SimpleInput
            id={`string-${index}-mppt`}
            label="MPPT"
            placeholder="Número do MPPT"
            value={item.mpptNumber}
            inputMode="numeric"
            required
            onChange={(mpptNumber) => updateString(index, { mpptNumber })}
          />

          <SimpleInput
            id={`string-${index}-entry`}
            label="Entrada"
            placeholder="Número da entrada no MPPT"
            value={item.entryNumber}
            inputMode="numeric"
            required
            onChange={(entryNumber) => updateString(index, { entryNumber })}
          />

          <Combobox
            required
            label="Modelo da placa"
            placeholder="Digite o modelo da placa"
            value={item.panelModel}
            options={panelModels.map((model) => ({
              value: panelModelLabel(model),
              label: panelModelLabel(model),
            }))}
            onChange={(panelModel) => updateString(index, { panelModel })}
          />

          <SimpleInput
            id={`string-${index}-invoice`}
            label="Nota fiscal"
            placeholder="Número da nota fiscal"
            value={item.invoiceNumber}
            required
            onChange={(invoiceNumber) => updateString(index, { invoiceNumber })}
          />

          <DatePicker
            label="Data de aquisição"
            value={item.acquisitionDt}
            required
            onChange={(acquisitionDt) => updateString(index, { acquisitionDt })}
          />

          <SimpleInput
            id={`string-${index}-cost`}
            label="Custo unitário (opcional)"
            placeholder="Ex.: 850.00"
            value={item.unitCost}
            inputMode="decimal"
            onChange={(unitCost) => updateString(index, { unitCost })}
          />

          {item.panels.map((panel, panelIndex) => (
            <div className="branches-inverter-strings__panel" key={panel.uid}>
              <SimpleInput
                id={`string-${index}-panel-${panelIndex}-serial`}
                label={`Placa ${panelIndex + 1} · número de série`}
                placeholder="Número de série"
                value={panel.serialNumber}
                required
                onChange={(serialNumber) =>
                  updatePanel(index, panelIndex, { serialNumber })
                }
              />
              <SimpleInput
                id={`string-${index}-panel-${panelIndex}-barcode`}
                label={`Placa ${panelIndex + 1} · código de barras`}
                placeholder="Código de barras"
                value={panel.barcode}
                required
                onChange={(barcode) =>
                  updatePanel(index, panelIndex, { barcode })
                }
              />
              {item.panels.length > 1 && (
                <Button
                  variant="secondary"
                  onClick={() =>
                    updateString(index, {
                      panels: item.panels.filter((_, i) => i !== panelIndex),
                    })
                  }
                >
                  Remover placa
                </Button>
              )}
            </div>
          ))}

          <Button
            variant="secondary"
            onClick={() =>
              updateString(index, {
                panels: [...item.panels, createEmptyInverterPanel()],
              })
            }
          >
            Adicionar placa
          </Button>

          {strings.length > 1 && (
            <Button
              variant="secondary"
              onClick={() => onChange(strings.filter((_, i) => i !== index))}
            >
              Remover string
            </Button>
          )}
        </fieldset>
      ))}

      {canAdd && (
        <Button
          variant="secondary"
          onClick={() => onChange([...strings, createEmptyInverterString()])}
        >
          Adicionar string
        </Button>
      )}
    </div>
  )
}
