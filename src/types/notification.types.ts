export type NotificationType =
  | 'ALERT_ACTIVE'
  | 'ALERT_CRITICAL'
  | 'RELOCATION_RECEIVED'
  | 'RELOCATION_APPROVED'
  | 'RELOCATION_REJECTED'
  | 'EXTERNAL_RELOCATION_CANDIDATE'
  | 'SERVICE_ORDER_OPENED'
  | 'SERVICE_ORDER_COMPLETED'

export type NotificationTone =
  'info' | 'success' | 'alert' | 'error' | 'neutral'

export interface NotificationDto {
  id: string
  maintenanceId: number | null
  type: string
  title: string
  body: string
  read: boolean
  createdAt: string
}

export interface NotificationItem {
  id: string
  type: string
  title: string
  description: string
  time: string
  read: boolean
  to?: string
}
