import { NavLink } from 'react-router-dom'
import { paths } from '../../routes/paths'
import type { SidebarProps } from '../../types/ui.types'
import { normalizeRole } from '../../utils/user'
import './Sidebar.css'

export function Sidebar({ items, role }: SidebarProps) {
  const currentRole = role === undefined ? undefined : normalizeRole(role)
  const visibleItems = items.filter(
    (item) => !item.roles || (currentRole !== undefined && item.roles.includes(currentRole)),
  )

  return (
    <aside className="sidebar">
      <img className="sidebar__logo" src="/apollo-logo.svg" alt="Apollo" width={41} height={70} />

      <nav className="sidebar__nav" aria-label="Menu principal">
        <ul className="sidebar__list">
          {visibleItems.map(({ to, label, icon: ItemIcon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === paths.home}
                className={({ isActive }) =>
                  isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'
                }
              >
                <ItemIcon className="sidebar__icon" />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
