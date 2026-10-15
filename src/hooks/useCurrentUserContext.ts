import { useContext } from 'react'
import { CurrentUserContext } from '../contexts/current-user.context'

export function useCurrentUserContext() {
  const context = useContext(CurrentUserContext)

  if (!context) {
    throw new Error(
      'useCurrentUserContext deve ser usado dentro de <CurrentUserProvider>.',
    )
  }

  return context
}
