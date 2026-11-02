import { Navigate, Outlet, useOutletContext } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import type { LayoutContext } from '../types/ui.types'
import { normalizeRole } from '../utils/user'
import { paths } from './paths'

interface PrivateRouteProps {
  roles?: string[]
}

export function PrivateRoute({ roles }: PrivateRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const outletContext = useOutletContext<LayoutContext>()

  if (!isAuthenticated) return <Navigate to={paths.login} replace />

  if (!roles) return <Outlet context={outletContext} />

  if (isLoading) return null

  const allowed = user !== null && roles.includes(normalizeRole(user.role))

  return allowed ? (
    <Outlet context={outletContext} />
  ) : (
    <Navigate to={paths.home} replace />
  )
}
