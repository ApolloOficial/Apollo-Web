import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { CurrentUserProvider } from '../../contexts/CurrentUserProvider'
import { useCurrentUserContext } from '../../hooks/useCurrentUserContext'
import { navigationItems } from '../../routes/navigation.config'
import { paths } from '../../routes/paths'
import { UNAUTHORIZED_EVENT } from '../../utils/events'
import type { LayoutContext } from '../../types/ui.types'
import { clearSession } from '../../utils/session'
import { Header } from '../header'
import { Sidebar } from '../sidebar'
import './Layout.css'

export function Layout() {
  return (
    <CurrentUserProvider>
      <LayoutContent />
    </CurrentUserProvider>
  )
}

function LayoutContent() {
  const navigate = useNavigate()
  const { user, loading } = useCurrentUserContext()

  useEffect(() => {
    function handleUnauthorized() {
      navigate(paths.login, { replace: true })
    }

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)

    return () =>
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
  }, [navigate])

  function handleLogout() {
    clearSession()
    navigate(paths.login)
  }

  return (
    <div className="layout">
      <Sidebar items={navigationItems} role={user?.role} />
      <div className="layout__main">
        <Header user={user} loading={loading} onLogout={handleLogout} />
        <main className="layout__content">
          <Outlet context={{ user, loading } satisfies LayoutContext} />
        </main>
      </div>
    </div>
  )
}
