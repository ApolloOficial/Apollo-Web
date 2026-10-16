import { useCallback, useEffect, useState } from 'react'
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../services/notifications.service'
import type { NotificationItem } from '../types/notification.types'

const POLL_MS = 30_000

export function useNotifications(enabled: boolean) {
  const [items, setItems] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return

    let active = true

    function load() {
      listNotifications().then((result) => {
        if (!active) return
        setLoading(false)
        if (result.ok) {
          setItems(result.data)
          setError(null)
        } else {
          setError(result.error)
        }
      })
    }

    load()
    const timer = window.setInterval(load, POLL_MS)

    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [enabled])

  const markAsRead = useCallback((item: NotificationItem) => {
    if (item.read) return
    setItems((current) =>
      current.map((n) => (n.id === item.id ? { ...n, read: true } : n)),
    )
    markNotificationRead(item.id).then((result) => {
      if (!result.ok) setError(result.error)
    })
  }, [])

  const markAllAsRead = useCallback(() => {
    setItems((current) => current.map((n) => ({ ...n, read: true })))
    markAllNotificationsRead().then((result) => {
      if (!result.ok) setError(result.error)
    })
  }, [])

  const hasUnread = items.some((n) => !n.read)

  return { items, loading, error, hasUnread, markAsRead, markAllAsRead }
}
