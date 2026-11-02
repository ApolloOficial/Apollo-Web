import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router-dom'
import type { NotificationItem } from '../../types/notification.types'
import { Spinner } from '../spinner'
import { getNotificationVisual } from './notification.config'
import './NotificationsPanel.css'

interface NotificationsPanelProps {
  items: NotificationItem[]
  loading?: boolean
  error?: string | null
  onItemClick: (item: NotificationItem) => void
  onClose: () => void
}

export function NotificationsPanel({
  items,
  loading = false,
  error = null,
  onItemClick,
  onClose,
}: NotificationsPanelProps) {
  const navigate = useNavigate()
  const unread = items.filter((item) => !item.read).length

  function handleClick(item: NotificationItem) {
    onItemClick(item)
    onClose()
    if (item.to) navigate(item.to)
  }

  return (
    <div className="notifications" role="dialog" aria-label="Notificações">
      <div className="notifications__header">
        <h2 className="notifications__title">Notificações</h2>
        {unread > 0 && <span className="notifications__badge">{unread}</span>}
      </div>

      {error && (
        <p className="notifications__empty" role="alert">
          {error}
        </p>
      )}

      {loading && items.length === 0 ? (
        <p className="notifications__empty" role="status" aria-busy="true">
          <Spinner />
          <span className="sr-only">Carregando notificações</span>
        </p>
      ) : items.length === 0 ? (
        <p className="notifications__empty">Nenhuma notificação por aqui.</p>
      ) : (
        <ul className="notifications__list">
          {items.map((item) => {
            const visual = getNotificationVisual(item.type)
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`notifications__item ${item.read ? 'notifications__item--read' : 'notifications__item--unread'}`}
                  onClick={() => handleClick(item)}
                >
                  <span
                    className={`notifications__icon notifications__icon--${visual.tone}`}
                  >
                    <Icon
                      icon={visual.icon}
                      width={28}
                      height={28}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="notifications__content">
                    <span className="notifications__item-title">
                      {item.title}
                    </span>
                    <span className="notifications__item-desc">
                      {item.description}
                    </span>
                  </span>
                  <time className="notifications__time">{item.time}</time>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
