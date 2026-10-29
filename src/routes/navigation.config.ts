import { ChartIcon } from '../components/icons/chart-icon'
import { HomeIcon } from '../components/icons/home-icon'
import { RelocationIcon } from '../components/icons/relocation-icon'
import { ServiceOrderIcon } from '../components/icons/service-order-icon'
import { SirenIcon } from '../components/icons/siren-icon'
import { SolarPanelIcon } from '../components/icons/solar-panel-icon'
import { UsersIcon } from '../components/icons/users-icon'
import type { NavigationItem } from '../types/navigation.types'
import { ROLE } from '../utils/user'
import { paths } from './paths'

export const navigationItems: NavigationItem[] = [
  { label: 'Início', to: paths.home, icon: HomeIcon },
  { label: 'Alertas', to: paths.alerts, icon: SirenIcon },
  { label: 'OS', to: paths.serviceOrders, icon: ServiceOrderIcon },
  { label: 'Realocações', to: paths.relocations, icon: RelocationIcon },
  { label: 'Filiais', to: paths.branches, icon: SolarPanelIcon },
  {
    label: 'Funcionários',
    to: paths.employees,
    icon: UsersIcon,
    roles: [ROLE.MANAGER],
  },
  {
    label: 'Métricas',
    to: paths.metrics,
    icon: ChartIcon,
    children: [
      { label: 'Corporativas', to: paths.metricsCorporate },
      { label: 'Solares', to: paths.metricsSolar },
    ],
  },
]
