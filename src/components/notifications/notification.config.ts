import type {
  NotificationTone,
  NotificationType,
} from '../../types/notification.types'

interface NotificationVisual {
  icon: string
  tone: NotificationTone
}

const DEFAULT_VISUAL: NotificationVisual = {
  icon: 'lucide:bell',
  tone: 'info',
}

export function getNotificationVisual(type: string): NotificationVisual {
  return notificationVisuals[type as NotificationType] ?? DEFAULT_VISUAL
}

export const notificationVisuals: Record<NotificationType, NotificationVisual> =
  {
    ALERT_ACTIVE: { icon: 'lucide:circle-alert', tone: 'alert' },
    ALERT_CRITICAL: { icon: 'lucide:siren', tone: 'error' },
    RELOCATION_RECEIVED: { icon: 'lucide:route', tone: 'info' },
    RELOCATION_APPROVED: { icon: 'lucide:circle-check', tone: 'success' },
    RELOCATION_REJECTED: { icon: 'lucide:circle-x', tone: 'error' },
    EXTERNAL_RELOCATION_CANDIDATE: {
      icon: 'lucide:square-dashed',
      tone: 'neutral',
    },
    SERVICE_ORDER_OPENED: { icon: 'lucide:clipboard-list', tone: 'info' },
    SERVICE_ORDER_COMPLETED: {
      icon: 'lucide:clipboard-check',
      tone: 'success',
    },
  }
