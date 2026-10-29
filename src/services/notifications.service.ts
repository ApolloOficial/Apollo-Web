import { request } from './http'
import { notificationRoute } from '../components/notifications/notification.routes'
import type {
  NotificationDto,
  NotificationItem,
  NotificationType,
  ServiceResult,
  UnreadCountDto,
} from '../types/notification.types'

const KNOWN_TYPES: NotificationType[] = [
  'ALERT_ACTIVE',
  'ALERT_CRITICAL',
  'RELOCATION_RECEIVED',
  'RELOCATION_APPROVED',
  'RELOCATION_REJECTED',
  'EXTERNAL_RELOCATION_CANDIDATE',
  'SERVICE_ORDER_OPENED',
  'SERVICE_ORDER_COMPLETED',
]

function errorMessage(cause: unknown, fallback: string) {
  return cause instanceof Error ? cause.message : fallback
}

function toType(value: string): NotificationType {
  return KNOWN_TYPES.includes(value as NotificationType)
    ? (value as NotificationType)
    : 'SERVICE_ORDER_OPENED'
}

function formatTime(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  const now = new Date()
  const sameDay = date.toDateString() === now.toDateString()

  return sameDay
    ? date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export function toNotificationItem(dto: NotificationDto): NotificationItem {
  const type = toType(dto.type)
  return {
    id: dto.id,
    type,
    title: dto.title,
    description: dto.body,
    time: formatTime(dto.createdAt),
    read: dto.read,
    to: notificationRoute(type, dto.maintenanceId),
  }
}

export async function listNotifications(
  size = 20,
): Promise<ServiceResult<NotificationItem[]>> {
  try {
    const data = await request<NotificationDto[]>(
      `/notifications?page=0&size=${size}`,
    )
    return { ok: true, data: (data ?? []).map(toNotificationItem) }
  } catch (cause) {
    return {
      ok: false,
      error: errorMessage(cause, 'Não foi possível carregar as notificações.'),
    }
  }
}

export async function getUnreadCount(): Promise<ServiceResult<number>> {
  try {
    const data = await request<UnreadCountDto>('/notifications/unread-count')
    return { ok: true, data: data?.unread ?? 0 }
  } catch (cause) {
    return {
      ok: false,
      error: errorMessage(cause, 'Não foi possível contar as notificações.'),
    }
  }
}

export async function markNotificationRead(
  id: string,
): Promise<ServiceResult<null>> {
  try {
    await request<void>(`/notifications/${id}/read`, {
      method: 'PATCH',
    })
    return { ok: true, data: null }
  } catch (cause) {
    return {
      ok: false,
      error: errorMessage(cause, 'Não foi possível marcar como lida.'),
    }
  }
}

export async function markAllNotificationsRead(): Promise<ServiceResult<null>> {
  try {
    await request<{ updated: number }>('/notifications/read-all', {
      method: 'PATCH',
    })
    return { ok: true, data: null }
  } catch (cause) {
    return {
      ok: false,
      error: errorMessage(cause, 'Não foi possível marcar todas como lidas.'),
    }
  }
}
