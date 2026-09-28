import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthLayout } from '../components/auth-layout'
import Welcome from '../pages/welcome'
import { paths } from './paths'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path={paths.welcome} element={<Welcome />} />
      </Route>
      <Route path={paths.home} element={<Navigate to={paths.welcome} replace />} />
    </Routes>
  )
}
