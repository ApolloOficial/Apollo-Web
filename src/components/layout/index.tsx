import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { navigationItems } from '../../routes/navigation.config'
import { paths } from '../../routes/paths'
import { UNAUTHORIZED_EVENT } from '../../utils/events'
import type { LayoutContext } from '../../types/ui.types'
import { Header } from '../header'
import { Sidebar } from '../sidebar'
import './Layout.css'

export function Layout() {
  const navigate = useNavigate()
  const { user, isLoading: loading, signOut } = useAuth()

  useEffect(() => {
    function handleUnauthorized() {
      navigate(paths.login, { replace: true })
    }

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)

    return () =>
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
  }, [navigate])

  function handleLogout() {
    signOut()
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
