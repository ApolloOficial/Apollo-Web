import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthLayout } from '../components/auth-layout'
import { Layout } from '../components/layout'
import { ROLE } from '../utils/user'
import { PrivateRoute } from './PrivateRoute'
import { paths } from './paths'
import { PageLoading } from '../components/page-loading'

const EmployeeForm = lazy(() => import('../pages/employees/employee-form'))
const Branches = lazy(() => import('../pages/branches'))
const BranchInverterDetails = lazy(
  () => import('../pages/branches/mine-branch/inverter-details'),
)
const BranchInverterForm = lazy(
  () => import('../pages/branches/mine-branch/inverter-form'),
)
const BranchStringDetails = lazy(
  () => import('../pages/branches/mine-branch/string-details'),
)
const Employees = lazy(() => import('../pages/employees'))
const Alerts = lazy(() => import('../pages/alerts'))
const AlertDetails = lazy(() => import('../pages/alerts/alert-details'))
const ServiceOrder = lazy(() => import('../pages/service-order'))
const ServiceOrderDetails = lazy(
  () => import('../pages/service-order/service-order-details'),
)
const ServiceOrderForm = lazy(
  () => import('../pages/service-order/service-order-form'),
)
const FirstAccess = lazy(() => import('../pages/first-access'))
const ForgotPassword = lazy(() => import('../pages/forgot-password'))
const Home = lazy(() => import('../pages/home'))
const Login = lazy(() => import('../pages/login'))
const Metrics = lazy(() => import('../pages/metrics'))
const NotFound = lazy(() => import('../pages/not-found'))
const PermissionDenied = lazy(() => import('../pages/permission-denied'))
const ResetPassword = lazy(() => import('../pages/reset-password'))
const Relocations = lazy(() => import('../pages/relocations'))
const RelocationDetails = lazy(
  () => import('../pages/relocations/relocation-details'),
)
const RelocationsForm = lazy(
  () => import('../pages/relocations/relocations-form'),
)
const Welcome = lazy(() => import('../pages/welcome'))

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path={paths.welcome} element={<Welcome />} />
          <Route path={paths.login} element={<Login />} />
          <Route path={paths.forgotPassword} element={<ForgotPassword />} />
          <Route path={paths.resetPassword} element={<ResetPassword />} />
          <Route path={paths.updatePassword} element={<FirstAccess />} />
          <Route path={paths.permissionDenied} element={<PermissionDenied />} />
        </Route>

        <Route element={<Layout />}>
          <Route element={<PrivateRoute />}>
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
            <Route
              path={paths.metrics}
              element={<Navigate to={paths.metricsCorporate} replace />}
            />
            <Route
              path={paths.metricsCorporate}
              element={<Metrics type="corporate" />}
            />
            <Route
              path={paths.metricsSolar}
              element={<Metrics type="solar" />}
            />
            <Route
              path={paths.alerts}
              element={<Alerts audience="operator" />}
            />
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
            <Route path={paths.serviceOrders} element={<ServiceOrder />} />
            <Route
              path={paths.serviceOrderDetails}
              element={<ServiceOrderDetails />}
            />

            <Route element={<PrivateRoute roles={[ROLE.MANAGER]} />}>
              <Route path={paths.employees} element={<Employees />} />
              <Route path={paths.employeeCreate} element={<EmployeeForm />} />
              <Route
                path={paths.relocationManager}
                element={<Relocations audience="manager" />}
              />
              <Route
                path={paths.relocationManagerDetails}
                element={<RelocationDetails managerMode />}
              />
            </Route>

            <Route element={<PrivateRoute roles={[ROLE.OPERATOR]} />}>
              <Route
                path={paths.branchInverterCreate}
                element={<BranchInverterForm />}
              />
              <Route
                path={paths.alertServiceOrder}
                element={<ServiceOrderForm />}
              />
              <Route
                path={paths.relocationCreate}
                element={<RelocationsForm />}
              />
            </Route>

            <Route
              element={
                <PrivateRoute
                  roles={[ROLE.MANAGER, ROLE.OPERATOR, ROLE.ANALYST]}
                />
              }
            >
              <Route
                path={paths.relocations}
                element={<Relocations audience="operator" />}
              />
              <Route
                path={paths.relocationOperator}
                element={<Relocations audience="operator" />}
              />
              <Route
                path={paths.relocationDetails}
                element={<RelocationDetails />}
              />
            </Route>
          </Route>
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
