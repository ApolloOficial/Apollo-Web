import { Navigate, Outlet } from 'react-router-dom'
import { useCurrentUserContext } from '../hooks/useCurrentUserContext'
import { getSession } from '../utils/session'
import { normalizeRole } from '../utils/user'
import { paths } from './paths'

interface PrivateRouteProps {
  roles?: string[]
}

export function PrivateRoute({ roles }: PrivateRouteProps) {
  const { user, loading } = useCurrentUserContext()

  if (!getSession()) return <Navigate to={paths.login} replace />

  if (!roles) return <Outlet />

  if (loading) return null

  const allowed = user !== null && roles.includes(normalizeRole(user.role))

  return allowed ? <Outlet /> : <Navigate to={paths.home} replace />
}
