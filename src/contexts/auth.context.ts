import { createContext } from 'react'
import type { CurrentUserDto } from '../types/auth.types'
import type { StoredSession } from '../utils/session'

export type AuthSession = Omit<StoredSession, '_versao'>

export interface AuthContextValue {
  user: CurrentUserDto | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  signIn: (session: AuthSession) => Promise<CurrentUserDto>
  signOut: () => void
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
