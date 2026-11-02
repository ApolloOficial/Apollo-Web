import { Tag, type TagTone } from '../../../../components/tag'
import type { StatusVM, StatusToneVM } from '../../data-access/vm/Branches.vm'

interface Props {
  status: StatusVM
}

const tones: Record<StatusToneVM, TagTone> = {
  success: 'success',
  alert: 'alert',
  error: 'error',
  muted: 'muted',
  outline: 'outline',
}

export function BranchesStatusChip({ status }: Props) {
  return <Tag label={status.label} tone={tones[status.tone]} />
}
