import type { CurrentUserDto } from '../types/auth.types'
import { useAuth } from './useAuth'

export interface CurrentUserState {
  user: CurrentUserDto | null
  loading: boolean
  error: string | null
}

export function useCurrentUserContext(): CurrentUserState {
  const { user, isLoading, error } = useAuth()

  return { user, loading: isLoading, error }
}
