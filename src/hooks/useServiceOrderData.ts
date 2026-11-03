import { useMemo } from 'react'
import type { ServiceOrderFiltersViewModel } from '../pages/service-order/data-access/vm/ServiceOrder.vm'
import {
  getActiveTechnicians,
  getMaintenanceTypes,
  getWarning,
  postServiceOrder,
} from '../services/alerts.service'
import {
  getActiveTechnicians as getOrderTechnicians,
  getMaintenanceTypes as getOrderMaintenanceTypes,
  getServiceOrder,
  getServiceOrderIds,
  getServiceOrders,
  getServiceOrderWarning,
} from '../services/service-orders.service'
import { useApiResource } from './useApiResource'

const serviceOrderActions = { createServiceOrder: postServiceOrder }

export function useServiceOrderActions() {
  return serviceOrderActions
}

export function useServiceOrdersPage(
  filters: ServiceOrderFiltersViewModel,
  page: number,
  size: number,
) {
  const fetcher = useMemo(
    () => () => getServiceOrders({ filters, page, size }),
    [filters, page, size],
  )

  return useApiResource(
    fetcher,
    'Não foi possível carregar as ordens de serviço.',
  )
}

export function useServiceOrderLookups(
  companyUnitId: string | null,
  waitingForUser: boolean,
) {
  const fetcher = useMemo(
    () =>
      waitingForUser
        ? null
        : async () => {
            const [technicians, maintenanceTypes, orders] = await Promise.all([
              getOrderTechnicians(companyUnitId),
              getOrderMaintenanceTypes(),
              getServiceOrderIds(),
            ])

            return {
              technicians: technicians.content,
              maintenanceTypes,
              orderIds: orders.content.map((order) => order.id),
            }
          },
    [companyUnitId, waitingForUser],
  )

  return useApiResource(fetcher, 'Não foi possível carregar os filtros.')
}

export function useServiceOrderFormData(alertId: number | null) {
  const fetcher = useMemo(
    () =>
      alertId === null
        ? null
        : async () => {
            const warning = await getWarning(alertId)
            const [technicians, maintenanceTypes] = await Promise.all([
              getActiveTechnicians(warning.companyUnitId),
              getMaintenanceTypes(),
            ])

            return {
              warning,
              technicians: technicians.content,
              maintenanceTypes,
            }
          },
    [alertId],
  )

  return useApiResource(fetcher, 'Não foi possível carregar os dados da OS.')
}

export function useServiceOrderDetails(orderId: number | null) {
  const fetcher = useMemo(
    () =>
      orderId === null
        ? null
        : async () => {
            const order = await getServiceOrder(orderId)
            const warning = await getServiceOrderWarning(order.warningId)

            return { order, warning }
          },
    [orderId],
  )

  return useApiResource(
    fetcher,
    'Não foi possível carregar a ordem de serviço.',
  )
}
