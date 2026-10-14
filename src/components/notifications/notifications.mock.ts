import { paths } from '../../routes/paths'
import type { NotificationItem } from '../../types/notification.types'
import { normalizeRole } from '../../utils/user'

const managerNotifications: NotificationItem[] = [
  {
    id: 'm1',
    type: 'RELOCATION_RECEIVED',
    title: 'Realocação recebida',
    description: 'Filial de Sorocaba, SP aguarda sua aprovação.',
    time: '09:12',
    read: false,
    to: paths.relocationManager,
  },
]

const operatorNotifications: NotificationItem[] = [
  {
    id: 'o1',
    type: 'ALERT_ACTIVE',
    title: 'Alerta ativo',
    description: 'Lote ITJ-MAT-001 - eficiência crítica.',
    time: '10:58',
    read: false,
    to: paths.alerts,
  },
  {
    id: 'o2',
    type: 'RELOCATION_APPROVED',
    title: 'Solicitação aprovada',
    description: 'Realocação para filial de Petrolina, PE aprovada.',
    time: '10:12',
    read: false,
    to: paths.relocationOperator,
  },
  {
    id: 'o3',
    type: 'EXTERNAL_RELOCATION_CANDIDATE',
    title: 'Candidato à realocação externa',
    description: 'Segmento sugerido: Agronegócio.',
    time: '08:12',
    read: false,
    to: paths.relocations,
  },
]

export function getMockNotifications(role?: string): NotificationItem[] {
  if (!role) return []
  return normalizeRole(role) === 'GERENTE' ? managerNotifications : operatorNotifications
}
