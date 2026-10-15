import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthLayout } from '../components/auth-layout'
import { Layout } from '../components/layout'
import EmployeeForm from '../pages/employees/employee-form'
import Branches from '../pages/branches'
import BranchInverterDetails from '../pages/branches/mine-branch/inverter-details'
import BranchStringDetails from '../pages/branches/mine-branch/string-details'
import Employees from '../pages/employees'
import Alerts from '../pages/alerts'
import AlertDetails from '../pages/alerts/alert-details'
import ServiceOrder from '../pages/service-order'
import ServiceOrderDetails from '../pages/service-order/service-order-details'
import ServiceOrderForm from '../pages/service-order/service-order-form'
import FirstAccess from '../pages/first-access'
import ForgotPassword from '../pages/forgot-password'
import Home from '../pages/home'
import Login from '../pages/login'
import Metrics from '../pages/metrics'
import ResetPassword from '../pages/reset-password'
import Relocations from '../pages/relocations'
import RelocationDetails from '../pages/relocations/relocation-details'
import RelocationsForm from '../pages/relocations/relocations-form'
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

      <Route element={<Layout />}>
        <Route path={paths.home} element={<Home />} />
        <Route path={paths.branches} element={<Branches />} />
        <Route
          path={paths.branchStringDetails}
          element={<BranchStringDetails />}
        />
        <Route
          path={paths.branchInverterDetails}
          element={<BranchInverterDetails />}
        />
        {/*
          TODO: ao final do projeto, proteger estas duas rotas de funcionário para permitir
          somente usuários cujo role seja GERENTE.
        */}
        <Route path={paths.employees} element={<Employees />} />
        <Route path={paths.employeeCreate} element={<EmployeeForm />} />
        <Route
          path={paths.metrics}
          element={<Navigate to={paths.metricsCorporate} replace />}
        />
        <Route
          path={paths.metricsCorporate}
          element={<Metrics type="corporate" />}
        />
        <Route path={paths.metricsSolar} element={<Metrics type="solar" />} />
        {/* Rotas temporárias até a seleção automática de interface por role. */}
        <Route
          path={paths.relocations}
          element={<Relocations audience="operator" />}
        />
        <Route
          path={paths.relocationOperator}
          element={<Relocations audience="operator" />}
        />
        <Route
          path={paths.relocationManager}
          element={<Relocations audience="manager" />}
        />
        <Route path={paths.relocationCreate} element={<RelocationsForm />} />
        <Route path={paths.relocationDetails} element={<RelocationDetails />} />
        <Route
          path={paths.relocationManagerDetails}
          element={<RelocationDetails managerMode />}
        />
        <Route path={paths.alerts} element={<Alerts audience="operator" />} />
        <Route
          path={paths.alertsManager}
          element={<Alerts audience="manager" />}
        />
        <Route
          path={paths.alertDetails}
          element={<AlertDetails audience="operator" />}
        />
        <Route
          path={paths.alertManagerDetails}
          element={<AlertDetails audience="manager" />}
        />
        <Route path={paths.alertServiceOrder} element={<ServiceOrderForm />} />
        <Route path={paths.serviceOrders} element={<ServiceOrder />} />
        <Route
          path={paths.serviceOrderDetails}
          element={<ServiceOrderDetails />}
        />
      </Route>
    </Routes>
  )
}
