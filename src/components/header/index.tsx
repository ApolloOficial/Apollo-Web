import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { useLocation } from 'react-router-dom'
import type { HeaderProps } from '../../types/ui.types'
import { getInitials } from '../../utils/user'
import { GlobalSearch } from '../global-search'
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
  const notificationsRef = useRef<HTMLDivElement>(null)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const menuId = useId()
  const notificationsId = useId()
  const menuRef = useRef<HTMLUListElement>(null)
  const accountButtonRef = useRef<HTMLButtonElement>(null)
  const bellButtonRef = useRef<HTMLButtonElement>(null)
  const {
    items: notifications,
    loading: notificationsLoading,
    error: notificationsError,
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
      if (event.key === 'Escape') {
        setNotificationsOpen(false)
        bellButtonRef.current?.focus()
      }
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
      if (event.key === 'Escape') {
        setMenuOpen(false)
        accountButtonRef.current?.focus()
        return
      }

      if (!accountRef.current?.contains(document.activeElement)) return

      if (event.key === 'Tab') {
        setMenuOpen(false)
        accountButtonRef.current?.focus()
        return
      }

      const items = Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ??
          [],
      )
      const current = items.findIndex((item) => item === document.activeElement)
      let next: number

      switch (event.key) {
        case 'ArrowDown':
          next = current >= items.length - 1 ? 0 : current + 1
          break
        case 'ArrowUp':
          next = current <= 0 ? items.length - 1 : current - 1
          break
        case 'Home':
          next = 0
          break
        case 'End':
          next = items.length - 1
          break
        default:
          return
      }

      event.preventDefault()
      items[next]?.focus()
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
  }, [menuOpen])

  function closeNotifications() {
    setNotificationsOpen(false)
    bellButtonRef.current?.focus()
  }

  function handleAccountKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    setMenuOpen(true)
  }

  const initials = user ? getInitials(user.fullName) : ''

  return (
    <header className="header">
      {pathname !== '/' && (
        <div className="header__search">
          <GlobalSearch />
        </div>
      )}

      <div ref={notificationsRef} className="header__notifications">
        <button
          ref={bellButtonRef}
          className="header__action"
          type="button"
          aria-label="Notificações"
          aria-haspopup="dialog"
          aria-expanded={notificationsOpen}
          aria-controls={notificationsOpen ? notificationsId : undefined}
          onClick={() => setNotificationsOpen((current) => !current)}
        >
          <BellIcon className="header__bell" />
          {hasUnread && (
            <span className="header__bell-dot" aria-hidden="true" />
          )}
        </button>

        {notificationsOpen && (
          <NotificationsPanel
            id={notificationsId}
            items={notifications}
            loading={notificationsLoading}
            error={notificationsError}
            onItemClick={markAsRead}
            onClose={closeNotifications}
          />
        )}
      </div>

      <div ref={accountRef} className="header__account">
        <button
          ref={accountButtonRef}
          className="header__user"
          type="button"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-controls={menuOpen ? menuId : undefined}
          aria-busy={loading}
          onClick={() => setMenuOpen((current) => !current)}
          onKeyDown={handleAccountKeyDown}
        >
          <span className="header__avatar" aria-hidden="true">
            {initials}
          </span>

          <span className="header__user-info">
            <span className="header__user-name">
              {user?.fullName ?? (loading ? '' : 'Usuário')}
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
          <ul
            id={menuId}
            ref={menuRef}
            className="header__menu"
            role="menu"
            aria-label="Menu da conta"
          >
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
