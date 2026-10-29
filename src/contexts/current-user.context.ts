import { createContext } from 'react'
import type { CurrentUserState } from '../hooks/useCurrentUser'

export const CurrentUserContext = createContext<CurrentUserState | null>(null)
