import { NavLink, useLocation } from 'react-router-dom'
import { paths } from '../../routes/paths'
import type { SidebarProps } from '../../types/ui.types'
import { normalizeRole } from '../../utils/user'
import './Sidebar.css'

export function Sidebar({ items, role }: SidebarProps) {
  const { pathname } = useLocation()
  const currentRole = role === undefined ? undefined : normalizeRole(role)
  const visibleItems = items.filter(
    (item) =>
      !item.roles ||
      (currentRole !== undefined && item.roles.includes(currentRole)),
  )

  return (
    <aside className="sidebar">
      <img
        className="sidebar__logo"
        src="/apollo-logo.svg"
        alt="Apollo"
        width={41}
        height={70}
      />

      <nav className="sidebar__nav" aria-label="Menu principal">
        <ul className="sidebar__list">
          {visibleItems.map(({ to, label, icon: ItemIcon, children }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === paths.home}
                className={({ isActive }) =>
                  isActive
                    ? 'sidebar__link sidebar__link--active'
                    : 'sidebar__link'
                }
              >
                <ItemIcon className="sidebar__icon" />
                <span>{label}</span>
              </NavLink>

              {children && pathname.startsWith(to) && (
                <ul className="sidebar__sublist">
                  {children.map((child) => (
                    <li key={child.to}>
                      <NavLink
                        to={child.to}
                        className={({ isActive }) =>
                          isActive
                            ? 'sidebar__sublink sidebar__sublink--active'
                            : 'sidebar__sublink'
                        }
                      >
                        {child.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
