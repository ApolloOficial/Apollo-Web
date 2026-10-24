import { Button } from '../../../../../../components/button'
import { CheckIcon } from '../../../../../../components/icons/check-icon'
import type { ConnectionStatusVM } from '../../../../data-access/vm/Branches.vm'

interface Props {
  status: ConnectionStatusVM
  canTest: boolean
  entriesCount: number | null
  onTest: () => void
}

export function BranchesInverterConnectionTest({
  status,
  canTest,
  entriesCount,
  onTest,
}: Props) {
  return (
    <div className="branches-connection-test" aria-live="polite">
      {status === 'testing' && (
        <>
          <span
            className="branches-connection-test__spinner"
            aria-hidden="true"
          />
          <p className="branches-connection-test__label">Pedindo leitura...</p>
        </>
      )}

      {status === 'success' && (
        <>
          <span className="branches-connection-test__check">
            <CheckIcon />
          </span>
          <strong className="branches-connection-test__title">
            Conexão funcionando!
          </strong>
          <p className="branches-connection-test__hint">
            Leitura recebida agora
            {entriesCount !== null &&
              ` · ${entriesCount} ${
                entriesCount === 1
                  ? 'entrada de string pronta'
                  : 'entradas de string prontas'
              }`}
            .
          </p>
        </>
      )}

      {(status === 'idle' || status === 'error') && (
        <>
          <div className="branches-connection-test__action">
            <Button fullWidth disabled={!canTest} onClick={onTest}>
              Testar conexão
            </Button>
          </div>

          {status === 'error' && (
            <p className="branches-connection-test__error" role="alert">
              Não foi possível receber a leitura. Confira os dados e tente
              novamente.
            </p>
          )}
        </>
      )}
    </div>
  )
}
