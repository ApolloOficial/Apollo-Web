import { matchPath } from 'react-router-dom'
import { paths } from './paths'

const PAGE_TITLES: ReadonlyArray<readonly [string, string]> = [
  [paths.welcome, 'Boas-vindas'],
  [paths.login, 'Entrar'],
  [paths.forgotPassword, 'Esqueci minha senha'],
  [paths.resetPassword, 'Redefinir senha'],
  [paths.updatePassword, 'Primeiro acesso'],
  [paths.permissionDenied, 'Acesso negado'],
  [paths.home, 'Início'],
  [paths.alertsManager, 'Alertas'],
  [paths.alertManagerDetails, 'Detalhes do alerta'],
  [paths.alertServiceOrder, 'Abrir ordem de serviço'],
  [paths.alerts, 'Alertas'],
  [paths.alertDetails, 'Detalhes do alerta'],
  [paths.serviceOrders, 'Ordens de serviço'],
  [paths.serviceOrderDetails, 'Detalhes da ordem de serviço'],
  [paths.relocationCreate, 'Solicitar realocação'],
  [paths.relocationManager, 'Realocações'],
  [paths.relocationOperator, 'Realocações'],
  [paths.relocations, 'Realocações'],
  [paths.relocationManagerDetails, 'Detalhes da realocação'],
  [paths.relocationDetails, 'Detalhes da realocação'],
  [paths.branchInverterCreate, 'Cadastrar inversor'],
  [paths.branchInverterDetails, 'Detalhes do inversor'],
  [paths.branchStringDetails, 'Detalhes da string'],
  [paths.branches, 'Filiais'],
  [paths.employeeCreate, 'Cadastrar funcionário'],
  [paths.employees, 'Funcionários'],
  [paths.metrics, 'Métricas'],
]

const NOT_FOUND_TITLE = 'Página não encontrada'

export function getPageTitle(pathname: string): string {
  const match = PAGE_TITLES.find(([pattern]) => matchPath(pattern, pathname))
  return match ? match[1] : NOT_FOUND_TITLE
}
