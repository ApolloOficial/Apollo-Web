import { Route, Routes } from 'react-router-dom'
import { AuthLayout } from '../components/auth-layout'
import EmployeeForm from '../pages/employees/employee-form'
import Employees from '../pages/employees'
import FirstAccess from '../pages/first-access'
import ForgotPassword from '../pages/forgot-password'
import Home from '../pages/home'
import Login from '../pages/login'
import ResetPassword from '../pages/reset-password'
import Welcome from '../pages/welcome'
import { paths } from './paths'

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
      {/*
        TODO: ao final do projeto, proteger estas duas rotas de funcionário para permitir
        somente usuários cujo role seja GERENTE.
      */}
      <Route path={paths.employees} element={<Employees />} />
      <Route path={paths.employeeCreate} element={<EmployeeForm />} />
    </Routes>
  )
}