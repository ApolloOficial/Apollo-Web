import { useCallback, useState } from 'react'
import { generatePath, useNavigate } from 'react-router-dom'
import { paths } from '../routes/paths'
import { getPanelById } from '../services/panels.service'
import type { CurrentUserDto } from '../types/auth.types'
import type { SearchCategory, SearchResultDto } from '../types/search.types'
import { isManager } from '../utils/user'
import { useCurrentUserContext } from './useCurrentUserContext'

type PathResolver = (
  item: SearchResultDto,
  user: CurrentUserDto | null,
) => string | Promise<string>

function withNameFilter(path: string, name: string) {
  return `${path}?${new URLSearchParams({ name })}`
}

const RESOLVERS: Record<SearchCategory, PathResolver> = {
  employees: (item) => withNameFilter(paths.employees, item.title),
  companyUnits: (item, user) =>
    item.id === user?.companyUnitId
      ? `${paths.branches}?tab=mine`
      : withNameFilter(paths.branches, item.title),
  inverters: (item) =>
    generatePath(paths.branchInverterDetails, { id: item.id }),
  panels: async (item) => {
    const panel = await getPanelById(item.id)

    return generatePath(paths.branchStringDetails, { id: panel.stringId })
  },
  relocations: (item, user) =>
    generatePath(
      isManager(user?.role)
        ? paths.relocationManagerDetails
        : paths.relocationDetails,
      {
        type: /^external/i.test(item.subtitle) ? 'external' : 'internal',
        id: item.id,
      },
    ),
}

export interface UseGlobalSearchNavigationResult {
  navigateToResult: (
    category: SearchCategory,
    item: SearchResultDto,
  ) => Promise<boolean>
  isResolving: boolean
  error: string | null
  clearError: () => void
}

export function useGlobalSearchNavigation(): UseGlobalSearchNavigationResult {
  const navigate = useNavigate()
  const { user } = useCurrentUserContext()
  const [isResolving, setIsResolving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => setError(null), [])

  const navigateToResult = useCallback(
    async (category: SearchCategory, item: SearchResultDto) => {
      setError(null)
      setIsResolving(true)

      try {
        const path = await RESOLVERS[category](item, user)

        navigate(path)
        return true
      } catch {
        setError('Não foi possível abrir o resultado. Tente novamente.')
        return false
      } finally {
        setIsResolving(false)
      }
    },
    [navigate, user],
  )

  return { navigateToResult, isResolving, error, clearError }
}
