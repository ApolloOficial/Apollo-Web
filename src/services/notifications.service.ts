import type { NotificationDto } from '../types/notification.types'
import { request } from './http'

export function getNotifications(page = 0, size = 20) {
  const query = new URLSearchParams({
    page: String(page),
    size: String(size),
  })

  return request<NotificationDto[]>(`/notifications?${query}`)
}

export function markNotificationAsRead(id: string) {
  return request<void>(`/notifications/${encodeURIComponent(id)}/read`, {
    method: 'PATCH',
  })
}
