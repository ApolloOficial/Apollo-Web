interface Props {
  serialNumber: string
}

export function BranchesInverterSungrowConnection({ serialNumber }: Props) {
  return (
    <div className="branches-sungrow-connection">
      <p className="branches-sungrow-connection__intro">
        O Apollo lê a geração deste inversor pela API da Sungrow (iSolarCloud).
      </p>

      <ol className="branches-sungrow-connection__steps">
        <li>A planta da filial é autorizada na Sungrow uma única vez.</li>
        <li>
          O Apollo encontra o inversor {serialNumber.trim()} pelo número de
          série.
        </li>
        <li>A geração passa a ser lida automaticamente.</li>
      </ol>
    </div>
  )
}
