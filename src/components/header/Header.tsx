import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import type { HeaderProps } from '../../types/ui.types'
import { getInitials } from '../../utils/user'
import { SearchInput } from '../inputs/search-input'
import { BellIcon } from '../icons/bell-icon'
import { ChevronRightIcon } from '../icons/chevron-right-icon'
import { LogoutIcon } from '../icons/logout-icon'
import { NotificationsPanel } from '../notifications'
import { useNotifications } from '../../hooks/useNotifications'
import './Header.css'

export function Header({ user, loading = false, onLogout }: HeaderProps) {
  const { pathname } = useLocation()
  const accountRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const notificationsRef = useRef<HTMLDivElement>(null)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const {
    items: notifications,
    hasUnread,
    markAsRead,
  } = useNotifications(user !== null)

  useEffect(() => {
    if (!notificationsOpen) return

    function handleOutsideClick(event: MouseEvent) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setNotificationsOpen(false)
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [notificationsOpen])

  useEffect(() => {
    if (!menuOpen) return

    function handleOutsideClick(event: MouseEvent) {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  const initials = user ? getInitials(user.fullName) : ''

  return (
    <header className="header">
      {pathname !== '/' && (
        <div className="header__search">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Busque por projetos, equipes e muito mais."
          />
        </div>
      )}

      <div ref={notificationsRef} className="header__notifications">
        <button
          className="header__action"
          type="button"
          aria-label="Notificações"
          aria-haspopup="dialog"
          aria-expanded={notificationsOpen}
          onClick={() => setNotificationsOpen((current) => !current)}
        >
          <BellIcon className="header__bell" />
          {hasUnread && (
            <span className="header__bell-dot" aria-hidden="true" />
          )}
        </button>

        {notificationsOpen && (
          <NotificationsPanel
            items={notifications}
            onItemClick={markAsRead}
            onClose={() => setNotificationsOpen(false)}
          />
        )}
      </div>

      <div ref={accountRef} className="header__account">
        <button
          className="header__user"
          type="button"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-busy={loading}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span className="header__avatar" aria-hidden="true">
            {initials}
          </span>

          <span className="header__user-info">
            <span className="header__user-name">
              {loading ? 'Carregando...' : (user?.fullName ?? 'Usuário')}
            </span>
            {user && (
              <span className="header__user-company">{user.companyName}</span>
            )}
          </span>

          <ChevronRightIcon
            className={
              menuOpen
                ? 'header__chevron header__chevron--open'
                : 'header__chevron'
            }
          />
        </button>

        {menuOpen && (
          <ul className="header__menu" role="menu">
            <li role="none">
              <button
                className="header__menu-item"
                type="button"
                role="menuitem"
                onClick={onLogout}
              >
                <LogoutIcon className="header__menu-icon" />
                <span>Sair</span>
              </button>
            </li>
          </ul>
        )}
      </div>
    </header>
  )
}
