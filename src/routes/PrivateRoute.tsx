import { Navigate, Outlet, useOutletContext } from 'react-router-dom'
import { useCurrentUserContext } from '../hooks/useCurrentUserContext'
import type { LayoutContext } from '../types/ui.types'
import { getSession } from '../utils/session'
import { normalizeRole } from '../utils/user'
import { paths } from './paths'

interface PrivateRouteProps {
  roles?: string[]
}

export function PrivateRoute({ roles }: PrivateRouteProps) {
  const { user, loading } = useCurrentUserContext()
  const outletContext = useOutletContext<LayoutContext>()

  if (!getSession()) return <Navigate to={paths.login} replace />

  if (!roles) return <Outlet context={outletContext} />

  if (loading) return null

  const allowed = user !== null && roles.includes(normalizeRole(user.role))

  return allowed ? (
    <Outlet context={outletContext} />
  ) : (
    <Navigate to={paths.home} replace />
  )
}
