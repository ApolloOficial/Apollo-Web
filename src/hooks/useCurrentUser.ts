import { useEffect, useState } from 'react'
import { getCurrentUser } from '../services/auth.service'
import type { CurrentUserDto } from '../types/auth.types'

export interface CurrentUserState {
  user: CurrentUserDto | null
  loading: boolean
  error: string | null
}

export function useCurrentUser(enabled = true): CurrentUserState {
  const [state, setState] = useState<CurrentUserState>({
    user: null,
    loading: enabled,
    error: null,
  })

  useEffect(() => {
    if (!enabled) return

    let active = true

    getCurrentUser()
      .then((user) => {
        if (active) setState({ user, loading: false, error: null })
      })
      .catch((err: Error) => {
        if (active) setState({ user: null, loading: false, error: err.message })
      })

    return () => {
      active = false
    }
  }, [enabled])

  return state
}
