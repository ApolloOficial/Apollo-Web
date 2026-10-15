import type { StatusVM } from '../../data-access/vm/Branches.vm'

interface Props {
  status: StatusVM
}

export function BranchesStatusChip({ status }: Props) {
  return (
    <span className={`branches-status branches-status--${status.tone}`}>
      {status.label}
    </span>
  )
}
