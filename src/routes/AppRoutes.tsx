import { Route, Routes } from 'react-router-dom'
import { AuthLayout } from '../components/auth-layout'
import ForgotPassword from '../pages/forgot-password'
import Login from '../pages/login'
import ResetPassword from '../pages/reset-password'
import Welcome from '../pages/welcome'
import Home from '../pages/home'
import { paths } from './paths'
import FirstAccess from '../pages/first-access'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path={paths.welcome} element={<Welcome />} />
        <Route path={paths.login} element={<Login />} />
        <Route path={paths.forgotPassword} element={<ForgotPassword />} />
        <Route path={paths.resetPassword} element={<ResetPassword />} />
        <Route path={paths.updatePassword} element={<FirstAccess />} />
      </Route>
      <Route path={paths.home} element={<Home />} />
    </Routes>
  )
}
