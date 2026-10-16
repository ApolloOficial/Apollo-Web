import type { NotificationItem } from '../../types/notification.types'
import { normalizeRole } from '../../utils/user'
import { notificationRoute } from './notification.routes'

const managerNotifications: NotificationItem[] = [
  {
    id: 'm1',
    type: 'RELOCATION_RECEIVED',
    title: 'Realocação recebida',
    description: 'Filial de Sorocaba, SP aguarda sua aprovação.',
    time: '09:12',
    read: false,
    to: notificationRoute('RELOCATION_RECEIVED'),
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
    to: notificationRoute('ALERT_ACTIVE'),
  },
  {
    id: 'o2',
    type: 'RELOCATION_APPROVED',
    title: 'Solicitação aprovada',
    description: 'Realocação para filial de Petrolina, PE aprovada.',
    time: '10:12',
    read: false,
    to: notificationRoute('RELOCATION_APPROVED'),
  },
  {
    id: 'o3',
    type: 'EXTERNAL_RELOCATION_CANDIDATE',
    title: 'Candidato à realocação externa',
    description: 'Segmento sugerido: Agronegócio.',
    time: '08:12',
    read: false,
    to: notificationRoute('EXTERNAL_RELOCATION_CANDIDATE'),
  },
]

export function getMockNotifications(role?: string): NotificationItem[] {
  if (!role) return []
  return normalizeRole(role) === 'GERENTE'
    ? managerNotifications
    : operatorNotifications
}
