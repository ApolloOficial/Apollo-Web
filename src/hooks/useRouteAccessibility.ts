import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { getPageTitle } from '../routes/page-titles'

const APP_NAME = 'Apollo'

export function useRouteAccessibility(): string {
  const { pathname } = useLocation()
  const previousPath = useRef(pathname)
  const title = getPageTitle(pathname)

  useEffect(() => {
    document.title = `${title} · ${APP_NAME}`
  }, [title])

  useEffect(() => {
    if (previousPath.current === pathname) return
    previousPath.current = pathname

    const main = document.querySelector<HTMLElement>('main')
    if (!main) return

    const active = document.activeElement
    if (active && active !== main && main.contains(active)) return

    main.focus({ preventScroll: true })
  }, [pathname])

  return title
}
