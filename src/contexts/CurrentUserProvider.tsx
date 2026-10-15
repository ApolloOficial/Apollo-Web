import type { ReactNode } from 'react'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { CurrentUserContext } from './current-user.context'

interface Props {
  children: ReactNode
}

/**
 * Busca o usuário autenticado (GET /auth/me) uma única vez e o compartilha
 * com toda a árvore abaixo, evitando que cada tela chame o endpoint de novo.
 */
export function CurrentUserProvider({ children }: Props) {
  const state = useCurrentUser()

  return (
    <CurrentUserContext.Provider value={state}>
      {children}
    </CurrentUserContext.Provider>
  )
}
