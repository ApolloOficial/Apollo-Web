import { generatePath } from 'react-router-dom'
import { paths } from '../../routes/paths'
import type {
  NotificationDto,
  NotificationItem,
} from '../../types/notification.types'
import { formatDateTime } from '../../utils/formatters'

export function mapNotification(dto: NotificationDto): NotificationItem {
  return {
    id: dto.id,
    type: dto.type,
    title: dto.title,
    description: dto.body,
    time: formatDateTime(dto.createdAt),
    read: dto.read,
    to:
      dto.maintenanceId === null
        ? undefined
        : generatePath(paths.serviceOrderDetails, {
            id: String(dto.maintenanceId),
          }),
  }
}
