import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthLayout } from '../components/auth-layout'
import Login from '../pages/login'
import Welcome from '../pages/welcome'
import { paths } from './paths'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path={paths.welcome} element={<Welcome />} />
        <Route path={paths.login} element={<Login />} />
      </Route>
      <Route path={paths.home} element={<Navigate to={paths.welcome} replace />} />
    </Routes>
  )
}
