import { paths } from '../../routes/paths'
import type { NotificationType } from '../../types/notification.types'

export function notificationRoute(
  type: NotificationType,
  maintenanceId?: number | null,
): string | undefined {
  if (maintenanceId != null) {
    return paths.serviceOrderDetails.replace(':id', String(maintenanceId))
  }

  switch (type) {
    case 'ALERT_ACTIVE':
      return `${paths.alerts}?status=ATIVO`
    case 'ALERT_CRITICAL':
      return `${paths.alerts}?status=ATIVO&severity=CRITICA`
    case 'RELOCATION_RECEIVED':
      return `${paths.relocationManager}?status=PENDENTE`
    case 'RELOCATION_APPROVED':
      return `${paths.relocationOperator}?status=APROVADA`
    case 'RELOCATION_REJECTED':
      return `${paths.relocationOperator}?status=REJEITADA`
    case 'EXTERNAL_RELOCATION_CANDIDATE':
      return `${paths.relocationOperator}?type=EXTERNAL`
    case 'SERVICE_ORDER_OPENED':
    case 'SERVICE_ORDER_COMPLETED':
      return paths.serviceOrders
    default:
      return undefined
  }
}
