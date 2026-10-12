import { Outlet, useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { navigationItems } from '../../routes/navigation.config'
import { paths } from '../../routes/paths'
import type { LayoutContext } from '../../types/ui.types'
import { clearSession } from '../../utils/session'
import { Header } from '../header'
import { Sidebar } from '../sidebar'
import './Layout.css'

export function Layout() {
  const navigate = useNavigate()
  const { user, loading } = useCurrentUser()

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
