import { RelocationIcon } from '../../components/icons/relocation-icon'
import { ChartIcon } from '../../components/icons/chart-icon'
import { ServiceOrderIcon } from '../../components/icons/service-order-icon'
import { SirenIcon } from '../../components/icons/siren-icon'
import { SolarPanelIcon } from '../../components/icons/solar-panel-icon'
import { UsersIcon } from '../../components/icons/users-icon'
import { paths } from '../../routes/paths'
import type { HomeCardItem } from '../../types/home.types'
import { isManager } from '../../utils/user'

const managerCards: HomeCardItem[] = [
  {
    title: 'Métricas',
    description: 'Acompanhe o andamento da saúde de suas placas.',
    to: paths.metrics,
    icon: ChartIcon,
  },
  {
    title: 'Filiais',
    description: 'Acompanhe o andamento das filiais',
    to: paths.branches,
    icon: SolarPanelIcon,
  },
  {
    title: 'Equipe',
    description: 'Veja como sua equipe está se desempenhando.',
    to: paths.employees,
    icon: UsersIcon,
  },
  {
    title: 'Realocações',
    description: 'Visualize para onde suas placas estão indo e vindo.',
    to: paths.relocations,
    icon: RelocationIcon,
  },
]

const operatorCards: HomeCardItem[] = [
  {
    title: 'Alertas',
    description: 'Acompanhe os alertas das suas placas.',
    to: paths.alerts,
    icon: SirenIcon,
  },
  {
    title: 'OS',
    description: 'Veja as ordens de serviço da sua filial.',
    to: paths.serviceOrders,
    icon: ServiceOrderIcon,
  },
  {
    title: 'Filiais',
    description: 'Consulte os inversores, strings e placas.',
    to: paths.branches,
    icon: SolarPanelIcon,
  },
  {
    title: 'Realocações',
    description: 'Visualize para onde suas placas estão indo e vindo.',
    to: paths.relocations,
    icon: RelocationIcon,
  },
]

export function getHomeCards(role: string): HomeCardItem[] {
  return isManager(role) ? managerCards : operatorCards
}
