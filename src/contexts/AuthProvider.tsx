import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getCurrentUser } from '../services/auth.service'
import type { CurrentUserDto } from '../types/auth.types'
import { UNAUTHORIZED_EVENT } from '../utils/events'
import { clearSession, getSession, saveSession } from '../utils/session'
import {
  AuthContext,
  type AuthContextValue,
  type AuthSession,
} from './auth.context'

interface AuthProviderProps {
  children: ReactNode
}

interface AuthState {
  authenticated: boolean
  user: CurrentUserDto | null
  loading: boolean
  error: string | null
}

function initialState(): AuthState {
  const authenticated = getSession() !== null
  return { authenticated, user: null, loading: authenticated, error: null }
}

const SIGNED_OUT: AuthState = {
  authenticated: false,
  user: null,
  loading: false,
  error: null,
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(initialState)

  const loadUser = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }))

    try {
      const user = await getCurrentUser()
      setState({ authenticated: true, user, loading: false, error: null })
      return user
    } catch (cause) {
      setState((current) => ({
        ...current,
        user: null,
        loading: false,
        error:
          cause instanceof Error
            ? cause.message
            : 'Não foi possível carregar o usuário.',
      }))
      throw cause
    }
  }, [])

  useEffect(() => {
    if (!getSession()) return

    void (async () => {
      await Promise.resolve()
      await loadUser().catch(() => undefined)
    })()
  }, [loadUser])

  useEffect(() => {
    function handleUnauthorized() {
      setState(SIGNED_OUT)
    }

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)

    return () =>
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
  }, [])

  const signIn = useCallback(
    async (session: AuthSession) => {
      saveSession(session)
      setState((current) => ({ ...current, authenticated: true }))

      try {
        return await loadUser()
      } catch (cause) {
        clearSession()
        setState(SIGNED_OUT)
        throw cause
      }
    },
    [loadUser],
  )

  const signOut = useCallback(() => {
    clearSession()
    setState(SIGNED_OUT)
  }, [])

  const refreshUser = useCallback(async () => {
    await loadUser()
  }, [loadUser])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: state.user,
      isAuthenticated: state.authenticated,
      isLoading: state.loading,
      error: state.error,
      signIn,
      signOut,
      refreshUser,
    }),
    [state, signIn, signOut, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
