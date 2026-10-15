import { jsx as _jsx } from "react/jsx-runtime";
import { useCurrentUser } from '../hooks/useCurrentUser';
import { CurrentUserContext } from './current-user.context';
/**
 * Busca o usuário autenticado (GET /auth/me) uma única vez e o compartilha
 * com toda a árvore abaixo, evitando que cada tela chame o endpoint de novo.
 */
export function CurrentUserProvider({ children }) {
    const state = useCurrentUser();
    return (_jsx(CurrentUserContext.Provider, { value: state, children: children }));
}
